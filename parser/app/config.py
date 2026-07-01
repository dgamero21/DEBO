from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    olmocr_api_url: str = "http://localhost:8001/v1"
    olmocr_api_key: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
