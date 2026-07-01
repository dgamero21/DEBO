import logging
from dataclasses import asdict
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Auto-register all parsers
import app.parsers  # noqa: F401
from app.parsers.registry import get_parser, list_parsers
from app.parsers.detector import detect_bank
from app.parsers.ocr import extract_text

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Pago Parser Microservice",
    description="Stateless credit card statement PDF parser API",
    version="1.0.0",
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "pago-parser-service",
        "supported_banks": list_parsers(),
    }

@app.post("/parse", status_code=status.HTTP_200_OK)
async def parse_statement(file: UploadFile = File(...)):
    """Parse a credit card statement PDF and return structured JSON.
    
    Expects a multipart form-data upload with a 'file' field containing the PDF.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )

    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Error reading uploaded file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not read the uploaded file.",
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty.",
        )

    # 1. Extract text using olmOCR or fallback pdfplumber
    text = extract_text(content, filename=file.filename)
    if not text or not text.strip():
        logger.warning(f"OCR failed to extract text from {file.filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from the PDF statement. The file may be corrupted or unreadable.",
        )

    # 2. Detect bank from extracted text
    bank_slug = detect_bank(text)
    if not bank_slug:
        logger.warning(f"Could not identify bank from text in {file.filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported bank or invalid credit card statement format.",
        )

    # 3. Retrieve parser
    parser = get_parser(bank_slug)
    if not parser:
        logger.error(f"No registered parser found for detected bank: {bank_slug}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Parser implementation missing for bank: {bank_slug}.",
        )

    # 4. Parse statement text
    try:
        logger.info(f"Parsing statement for bank '{bank_slug}' using parser version {parser.parser_version}...")
        parsed_statement = parser.parse(text)
        
        # Convert dataclasses to dicts for JSON serialization
        statement_dict = asdict(parsed_statement)
        statement_dict["bank_slug"] = bank_slug
        statement_dict["parser_version"] = parser.parser_version
        
        return statement_dict
    except Exception as e:
        logger.error(f"Parser failed for bank '{bank_slug}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse statement format for bank: {bank_slug}. Error: {str(e)}",
        )
