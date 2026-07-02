import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BANK_STATEMENTS, 
  parseStatementText, 
  BankStatement, 
  MockTransaction 
} from "../data/statements";
import { supabase } from "../lib/supabase";
import { extractTextFromPDF, detectBankSlug } from "../lib/pdfExtractor";

import { 
  FileText, 
  UploadCloud, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  X, 
  CreditCard, 
  Calendar, 
  User, 
  Tag, 
  FolderMinus, 
  TrendingUp, 
  Layers, 
  LogOut,
  AlertCircle,
  TrendingDown,
  ChevronDown,
  Edit2
} from "lucide-react";

interface DashboardViewProps {
  onNavigate: (view: "landing" | "login" | "register" | "forgot" | "dashboard") => void;
  user?: any;
}

export default function DashboardView({ onNavigate, user }: DashboardViewProps) {
  // Currently viewed statement (null means none loaded yet — user must upload a PDF or use a preset)
  const [currentStatement, setCurrentStatement] = useState<BankStatement | null>(null);
  const [pasteAreaOpen, setPasteAreaOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [customFileError, setCustomFileError] = useState("");
  const [customFileSuccess, setCustomFileSuccess] = useState("");

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "expenses" | "credits">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Editable tags state: map of transaction index or desc to custom tags
  const [transactionTags, setTransactionTags] = useState<{ [key: string]: string[] }>({});
  const [newTagInput, setNewTagInput] = useState<{ [key: string]: string }>({});
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);

  // Unified Portfolio of Loaded Statements (The "ladd" or "Load & Add" mechanism)
  const [portfolio, setPortfolio] = useState<BankStatement[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);

  // Sync tags from statement when loaded
  useEffect(() => {
    if (currentStatement) {
      const initialTags: { [key: string]: string[] } = {};
      currentStatement.transactions.forEach((t, idx) => {
        initialTags[`${t.description}-${idx}`] = t.tags;
      });
      setTransactionTags(initialTags);
      setSelectedTag("all");
    }
  }, [currentStatement]);

  // Reset tag filter when switching views of portfolio
  useEffect(() => {
    setSelectedTag("all");
  }, [showPortfolio]);

  // Handle preset selection
  const handleSelectPreset = (slug: string) => {
    const found = BANK_STATEMENTS.find(b => b.bankSlug === slug);
    if (found) {
      setCurrentStatement(found);
      setCustomFileError("");
      setCustomFileSuccess(`Resumen preestablecido de ${found.bankName} cargado exitosamente.`);
    }
  };

  // Add loaded statement to the portfolio
  const handleAddToPortfolio = () => {
    if (!currentStatement) return;
    
    // Check if already in portfolio by bank slug & last four digits
    const exists = portfolio.some(
      b => b.bankSlug === currentStatement.bankSlug && b.cardLastFour === currentStatement.cardLastFour
    );

    if (exists) {
      setCustomFileError("Esta tarjeta ya se encuentra agregada a tu portafolio unificado.");
      return;
    }

    setPortfolio([...portfolio, currentStatement]);
    setCustomFileSuccess(`¡${currentStatement.bankName} agregado con éxito al portafolio unificado!`);
    setCustomFileError("");
  };

  // Remove statement from portfolio
  const handleRemoveFromPortfolio = (slug: string, lastFour: string) => {
    const updated = portfolio.filter(b => !(b.bankSlug === slug && b.cardLastFour === lastFour));
    setPortfolio(updated);
    if (currentStatement?.bankSlug === slug && currentStatement?.cardLastFour === lastFour) {
      setCurrentStatement(updated[0] || null);
    }
  };

  // Handle raw text pasting and parsing
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setCustomFileError("Por favor ingresa texto del resumen para analizar.");
      return;
    }

    const parsed = parseStatementText(pastedText);
    if (parsed) {
      setCurrentStatement(parsed);
      setPastedText("");
      setPasteAreaOpen(false);

      // Add to portfolio with dedup
      const isDuplicate = portfolio.some(
        (b) =>
          b.bankSlug === parsed.bankSlug &&
          b.cardLastFour === parsed.cardLastFour &&
          b.periodFrom === parsed.periodFrom &&
          b.periodTo === parsed.periodTo
      );

      if (isDuplicate) {
        setCustomFileError(
          `Este resumen de ${parsed.bankName} (${parsed.cardType} • ${parsed.cardLastFour}, periodo ${parsed.periodFrom} al ${parsed.periodTo}) ya fue cargado anteriormente. No se permiten duplicados.`
        );
        return;
      }

      setPortfolio([...portfolio, parsed]);
      setCustomFileSuccess(`¡Resumen de ${parsed.bankName} extraído y analizado correctamente!`);
      setCustomFileError("");
    } else {
      setCustomFileError("No se pudo detectar el formato. Asegúrate de incluir palabras clave como Galicia, Santander o Macro, y montos válidos.");
    }
  };

  // ── PDF Upload state ──
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [pendingRawText, setPendingRawText] = useState("");
  const [pendingFileName, setPendingFileName] = useState("");

  // ── Real PDF Upload with OCR + bank detection + dedup ──
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setCustomFileError("Formato no soportado. Por favor sube un archivo PDF del resumen.");
      return;
    }

    setIsProcessing(true);
    setCustomFileError("");
    setCustomFileSuccess("");

    try {
      // 1. Extract text from PDF using pdfjs-dist
      const extractedText = await extractTextFromPDF(file);

      if (!extractedText.trim()) {
        setCustomFileError(
          "No se pudo extraer texto del PDF. Asegúrate de que no sea un documento escaneado (sin texto seleccionable)."
        );
        setIsProcessing(false);
        // Reset the file input so user can retry
        e.target.value = "";
        return;
      }

      // 2. Detect bank from the extracted text
      const detectedSlug = detectBankSlug(extractedText);

      if (!detectedSlug) {
        // Bank not recognized — show bank selector modal
        setPendingRawText(extractedText);
        setPendingFileName(file.name);
        setShowBankSelector(true);
        setIsProcessing(false);
        e.target.value = "";
        return;
      }

      // 3. Bank detected — parse directly
      const parsed = parseStatementText(extractedText, detectedSlug as "galicia" | "santander" | "macro" | "nacion" | "bbva" | "naranja");
      if (parsed) {
        addToPortfolioWithDedup(parsed, extractedText, file.name);
      } else {
        setCustomFileError("No se pudo analizar el contenido del PDF con el formato detectado.");
      }
    } catch (err) {
      console.error("PDF processing error:", err);
      setCustomFileError("Error al procesar el PDF. Intenta de nuevo.");
    }

    setIsProcessing(false);
    e.target.value = "";
  };

  // ── Bank selector: user picks the bank when auto-detection fails ──
  const handleBankSelected = async (slug: "galicia" | "santander" | "macro" | "nacion" | "bbva" | "naranja") => {
    setShowBankSelector(false);
    setIsProcessing(true);

    // Inject bank name at the top so parseStatementText can detect it
    const bankNames: Record<string, string> = {
      galicia: "BANCO GALICIA",
      santander: "SANTANDER RIO",
      macro: "BANCO MACRO",
      nacion: "BANCO DE LA NACION ARGENTINA",
      bbva: "BBVA FRANCES",
      naranja: "NARANJA",
    };
    const enrichedText = `${bankNames[slug]} - RESUMEN DE CUENTA\n${pendingRawText}`;
    const parsed = parseStatementText(enrichedText, slug);

    if (parsed) {
      addToPortfolioWithDedup(parsed, pendingRawText, pendingFileName);
    } else {
      setCustomFileError(
        "No se pudo analizar el resumen con el banco seleccionado. Verificá que el PDF tenga el formato correcto."
      );
    }

    setIsProcessing(false);
    setPendingRawText("");
    setPendingFileName("");
  };

  const handleCancelBankSelector = () => {
    setShowBankSelector(false);
    setPendingRawText("");
    setPendingFileName("");
  };

  // ── Add to portfolio with duplicate validation ──
  const addToPortfolioWithDedup = (
    parsed: BankStatement,
    rawText: string,
    fileName: string
  ) => {
    // Check for duplicate: same bank + same card last four + same period
    const isDuplicate = portfolio.some(
      (b) =>
        b.bankSlug === parsed.bankSlug &&
        b.cardLastFour === parsed.cardLastFour &&
        b.periodFrom === parsed.periodFrom &&
        b.periodTo === parsed.periodTo
    );

    if (isDuplicate) {
      setCustomFileError(
        `Este resumen de ${parsed.bankName} (${parsed.cardType} • ${parsed.cardLastFour}, periodo ${parsed.periodFrom} al ${parsed.periodTo}) ya fue cargado anteriormente. No se permiten duplicados.`
      );
      return;
    }

    // All good — add to portfolio
    setCurrentStatement(parsed);
    const updatedPortfolio = [...portfolio, parsed];
    setPortfolio(updatedPortfolio);
    setCustomFileSuccess(
      `¡Resumen de ${parsed.bankName} extraído y analizado correctamente desde "${fileName}"!`
    );
  };

  // Tag management
  const handleAddTag = (txKey: string) => {
    const val = newTagInput[txKey]?.trim();
    if (!val) return;

    const currentTags = transactionTags[txKey] || [];
    if (currentTags.includes(val)) return;

    const updated = {
      ...transactionTags,
      [txKey]: [...currentTags, val]
    };

    setTransactionTags(updated);
    setNewTagInput({
      ...newTagInput,
      [txKey]: ""
    });
    setEditingTagIndex(null);
  };

  const handleRemoveTag = (txKey: string, tagToRemove: string) => {
    const currentTags = transactionTags[txKey] || [];
    const updated = {
      ...transactionTags,
      [txKey]: currentTags.filter(t => t !== tagToRemove)
    };
    setTransactionTags(updated);
  };

  // Merge portfolio transactions and metadata for a truly unified overview
  const getUnifiedPortfolioData = () => {
    if (portfolio.length === 0) return null;

    let totalAmount = 0;
    let minimumPayment = 0;
    let newCharges = 0;
    let previousBalance = 0;
    let paymentReceived = 0;
    let allTransactions: MockTransaction[] = [];

    portfolio.forEach(b => {
      totalAmount += b.totalAmount;
      minimumPayment += b.minimumPayment;
      newCharges += b.newCharges;
      previousBalance += b.previousBalance;
      paymentReceived += b.paymentReceived;
      allTransactions = [...allTransactions, ...b.transactions];
    });

    // Sort combined transactions by date descending
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      bankName: "Portafolio Unificado",
      bankSlug: "unified" as any,
      cardType: "visa" as any,
      cardLastFour: "COMBINED",
      holderName: portfolio[0].holderName,
      periodFrom: portfolio[0].periodFrom,
      periodTo: portfolio[0].periodTo,
      dueDate: portfolio[0].dueDate,
      totalAmount,
      minimumPayment,
      previousBalance,
      paymentReceived,
      newCharges,
      interestCharges: 0,
      otherCharges: 0,
      transactions: allTransactions,
      rawText: ""
    };
  };

  // Dynamic Unique Tags from displayStatement
  const getStatementTags = () => {
    if (!displayStatement) return [];
    const tagsSet = new Set<string>();
    
    displayStatement.transactions.forEach((tx, idx) => {
      const txKey = `${tx.description}-${idx}`;
      const tags = transactionTags[txKey] || tx.tags || [];
      tags.forEach(t => {
        if (t && t.trim()) {
          tagsSet.add(t.trim());
        }
      });
    });

    return Array.from(tagsSet);
  };

  // Determine active statement to display (either single current, or unified portfolio)
  const displayStatement = showPortfolio ? getUnifiedPortfolioData() : currentStatement;

  // Filter transactions
  const getFilteredTransactions = () => {
    if (!displayStatement) return [];

    return displayStatement.transactions.filter((tx, idx) => {
      const txKey = `${tx.description}-${idx}`;
      const currentTags = transactionTags[txKey] || tx.tags || [];

      // search query matches description or amount
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tx.amount.toString().includes(searchQuery);

      // category matches
      const matchesCategory = selectedCategory === "all" || tx.category === selectedCategory;

      // type matches (expenses: negative, credits: positive)
      const matchesType = 
        selectedType === "all" || 
        (selectedType === "expenses" && tx.amount < 0) || 
        (selectedType === "credits" && tx.amount > 0);

      // tag matches
      const matchesTag = 
        selectedTag === "all" || 
        currentTags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesCategory && matchesType && matchesTag;
    });
  };

  const filteredTxList = getFilteredTransactions();

  // Export to CSV
  const handleExportCSV = () => {
    if (!displayStatement) return;

    let csvContent = "data:text/csv;charset=utf-8,Fecha,Descripcion,Monto,Categoria,Etiquetas\n";
    displayStatement.transactions.forEach((tx, idx) => {
      const key = `${tx.description}-${idx}`;
      const tags = (transactionTags[key] || tx.tags).join(";");
      csvContent += `"${tx.date}","${tx.description.replace(/"/g, '""')}",${tx.amount},"${tx.category}","${tags}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `debo_resumen_${displayStatement.bankSlug}_${displayStatement.cardLastFour}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Category summary calculation
  const getCategoryStats = () => {
    if (!displayStatement) return [];

    const categoriesMap: { [key: string]: number } = {
      Alimentación: 0,
      Transporte: 0,
      Servicios: 0,
      Entretenimiento: 0,
      Tecnología: 0,
      Otros: 0
    };

    let totalExpenses = 0;
    displayStatement.transactions.forEach(t => {
      if (t.amount < 0) {
        const amt = Math.abs(t.amount);
        categoriesMap[t.category] = (categoriesMap[t.category] || 0) + amt;
        totalExpenses += amt;
      }
    });

    return Object.keys(categoriesMap).map(cat => ({
      name: cat,
      value: categoriesMap[cat],
      percentage: totalExpenses > 0 ? Math.round((categoriesMap[cat] / totalExpenses) * 100) : 0
    })).sort((a, b) => b.value - a.value);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      
      {/* ── Dashboard Header ── */}
      <nav id="nav-dashboard" className="sticky top-0 z-40 bg-bg-secondary/90 backdrop-blur-md border-b border-border-primary px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-dark text-white font-bold text-base flex items-center justify-center">
            D
          </div>
          <div>
            <p className="text-sm font-bold leading-none">DEBO Finanzas</p>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">Panel de Control</p>
          </div>
        </div>

        {/* Portfolio Tabs selector */}
        <div className="hidden md:flex items-center gap-1.5 bg-bg-primary p-1 rounded-full border border-border-secondary">
          <button 
            id="tab-single"
            onClick={() => setShowPortfolio(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${!showPortfolio ? "bg-accent-dark text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            Tarjeta Individual
          </button>
          <button 
            id="tab-unified"
            onClick={() => {
              if (portfolio.length > 0) setShowPortfolio(true);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1 ${portfolio.length === 0 ? "opacity-50 cursor-not-allowed" : ""} ${showPortfolio ? "bg-accent-dark text-white" : "text-text-secondary hover:text-text-primary"}`}
            disabled={portfolio.length === 0}
          >
            <Layers className="w-3.5 h-3.5" /> Portafolio Unificado ({portfolio.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-border-secondary">
            <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent-dark font-bold text-xs uppercase">
              {user?.user_metadata?.name ? user.user_metadata.name[0] : (currentStatement?.holderName ? currentStatement.holderName[0] : "U")}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-text-secondary">
              {user?.user_metadata?.name ? user.user_metadata.name.split(" ")[0] : (currentStatement?.holderName ? currentStatement.holderName.split(" ")[0] : "Usuario")}
            </span>
          </div>

          <button 
            id="btn-logout"
            onClick={async () => {
              await supabase.auth.signOut();
              onNavigate("landing");
            }}
            className="p-2 rounded-full hover:bg-bg-tertiary text-text-secondary hover:text-error-main transition-colors duration-200"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        
        {/* ── MAIN WORKSPACE (LEFT) ── */}
        <div className="space-y-6">

          {/* ── Status Messages ── */}
          {customFileSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-success-bg border border-success-main/10 text-success-main text-xs font-bold flex items-center justify-between"
            >
              <span>{customFileSuccess}</span>
              <button onClick={() => setCustomFileSuccess("")}><X className="w-4 h-4" /></button>
            </motion.div>
          )}

          {customFileError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-error-bg border border-error-main/10 text-error-main text-xs font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {customFileError}</span>
              <button onClick={() => setCustomFileError("")}><X className="w-4 h-4" /></button>
            </motion.div>
          )}

          {/* ── STATEMENT ADDER / OCR PANEL ── */}
          <section id="panel-ocr" className="rounded-3xl border border-border-primary bg-bg-secondary p-4 sm:p-6 shadow-sm space-y-6">
            
            {/* Header and Quick Select */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-accent-dark" /> Importar & Procesar Resumen
                </h2>
                <p className="text-xs text-text-secondary mt-1">Subí el PDF de tu tarjeta de crédito para analizar tus gastos (o seleccioná un banco de prueba).</p>
              </div>

              {/* Bank Presets */}
              <div className="flex flex-wrap gap-1.5">
                {BANK_STATEMENTS.map(b => (
                  <button
                    key={b.bankSlug}
                    onClick={() => handleSelectPreset(b.bankSlug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                      currentStatement?.bankSlug === b.bankSlug && !showPortfolio
                        ? "bg-accent-soft border-accent text-accent-dark"
                        : "bg-bg-primary border-border-secondary text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    {b.bankName}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop / PDF Upload area */}
            <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <div className="relative border-2 border-dashed border-border-primary rounded-2xl p-6 bg-bg-primary/40 hover:bg-bg-primary/80 transition-colors duration-200 text-center flex flex-col items-center justify-center gap-3 group">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  title="Sube tu archivo PDF del resumen"
                />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isProcessing ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-accent-soft text-accent-dark group-hover:scale-105'}`}>
                  {isProcessing ? (
                    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <div>
                  {isProcessing ? (
                    <p className="text-sm font-bold text-amber-700">Extrayendo texto del PDF...</p>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-text-primary">Arrastra tu PDF aquí o haz clic para subir</p>
                      <p className="text-[11px] text-text-tertiary mt-1">Soporta Galicia, Santander, Macro, Nación y Naranja</p>
                    </>
                  )}
                </div>
              </div>

              {/* Paste or Portfolio quick add info */}
              <div className="flex flex-col justify-between gap-4 p-5 rounded-2xl bg-bg-primary border border-border-secondary">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Agregar al Portafolio Unificado</p>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Combina múltiples tarjetas (por ejemplo, Galicia Mastercard + Santander Visa) para tener un solo gráfico y log de transacciones consolidado.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={handleAddToPortfolio}
                    className="flex-1 h-10 rounded-xl bg-accent-dark text-white font-bold text-xs hover:opacity-90 shadow-sm transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar al Portafolio
                  </button>
                  <button 
                    onClick={() => setPasteAreaOpen(!pasteAreaOpen)}
                    className="h-10 px-3 rounded-xl border border-border-primary bg-bg-secondary text-text-secondary text-xs font-bold hover:bg-bg-tertiary transition-all duration-200"
                    title="Pegar texto del resumen"
                  >
                    Pegar Texto
                  </button>
                </div>
              </div>
            </div>

            {/* Collapsible raw text paste box */}
            <AnimatePresence>
              {pasteAreaOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">Pegar Texto Crudo del Resumen</label>
                  <textarea 
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Pega aquí el contenido de texto copiado de tu PDF de Banco Galicia o Santander..."
                    rows={6}
                    className="w-full rounded-xl border border-border-primary bg-bg-primary p-3 text-xs font-mono outline-none focus:border-accent transition-all duration-200"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setPasteAreaOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-bg-tertiary"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleParsePastedText}
                      className="px-5 py-2 rounded-xl bg-accent text-white font-bold text-xs hover:opacity-90 transition-all duration-200"
                    >
                      Analizar Texto
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Bank Selector Modal (when bank not recognized) ── */}
            <AnimatePresence>
              {showBankSelector && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                  onClick={handleCancelBankSelector}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-bg-secondary border border-border-primary rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md space-y-5"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">Banco no reconocido</h3>
                      <p className="text-sm text-text-secondary">
                        No pudimos detectar automáticamente el banco en el archivo{' '}
                        <span className="font-bold text-text-primary">{pendingFileName}</span>.
                        Seleccioná el banco correspondiente:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { slug: "galicia", label: "Banco Galicia", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
                        { slug: "santander", label: "Banco Santander", color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" },
                        { slug: "macro", label: "Banco Macro", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
                        { slug: "nacion", label: "Banco Nación", color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100" },
                        { slug: "bbva", label: "BBVA Francés", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
                        { slug: "naranja", label: "Naranja", color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
                      ].map((bank) => (
                        <button
                          key={bank.slug}
                          onClick={() => handleBankSelected(bank.slug as any)}
                          className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all duration-200 ${bank.color}`}
                        >
                          {bank.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleCancelBankSelector}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-tertiary border border-border-secondary transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── PARSED RESULTS WORKSPACE ── */}
          {displayStatement ? (
            <div className="space-y-6">

              {/* ── STATEMENT METADATA OVERVIEW ── */}
              <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-4">
                
                {/* Total amount card */}
                <div className="rounded-2xl border border-border-secondary bg-bg-secondary p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary">Saldo Total a Pagar</span>
                  <p className="text-xl sm:text-2xl font-bold text-text-primary break-words">${displayStatement.totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-text-secondary">ARS</p>
                </div>

                {/* Minimum Payment */}
                <div className="rounded-2xl border border-border-secondary bg-bg-secondary p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary">Pago Mínimo Exigible</span>
                  <p className="text-xl sm:text-2xl font-bold text-text-primary break-words">${displayStatement.minimumPayment.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-text-secondary">Vto: {displayStatement.dueDate}</p>
                </div>

                {/* New charges / consumption */}
                <div className="rounded-2xl border border-border-secondary bg-bg-secondary p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary">Nuevos Consumos</span>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 break-words">${displayStatement.newCharges.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-text-secondary">Compras en periodo</p>
                </div>

                {/* Holder / Card Details */}
                <div className="rounded-2xl border border-border-secondary bg-bg-secondary p-4 sm:p-5 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary">Tarjeta</span>
                    <p className="text-xs sm:text-sm font-bold text-text-primary uppercase flex flex-wrap items-center gap-1.5 mt-0.5">
                      <CreditCard className="w-3.5 h-3.5 text-accent-dark shrink-0" /> 
                      <span className="truncate">{displayStatement.cardType} • {displayStatement.cardLastFour}</span>
                    </p>
                  </div>
                  <p className="text-[10px] text-text-tertiary truncate uppercase">{displayStatement.holderName}</p>
                </div>
              </div>

              {/* ── BENTO GRAPHICS ── */}
              <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
                
                {/* Custom SVG Expense Timeline Chart */}
                <div className="rounded-3xl border border-border-primary bg-bg-secondary p-4 sm:p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Evolución de Gastos Diarios</h3>
                      <p className="text-[10px] text-text-secondary">Línea de tiempo del mes en curso ({displayStatement.periodFrom} a {displayStatement.periodTo})</p>
                    </div>
                    <span className="text-xs font-bold text-accent-dark bg-accent-soft px-2.5 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Analítico
                    </span>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-48 w-full bg-bg-primary/40 rounded-2xl border border-border-secondary p-2 flex flex-col justify-between relative overflow-hidden">
                    {/* SVG Canvas drawing an area graph */}
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5d753e" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#5d753e" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      <line x1="0" y1="37" x2="500" y2="37" stroke="var(--color-border-secondary)" strokeDasharray="3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="var(--color-border-secondary)" strokeDasharray="3" />
                      <line x1="0" y1="112" x2="500" y2="112" stroke="var(--color-border-secondary)" strokeDasharray="3" />

                      {/* Area Fill */}
                      <path 
                        d="M 0 150 L 50 130 L 100 80 L 150 110 L 200 60 L 250 120 L 300 45 L 350 90 L 400 30 L 450 70 L 500 150 Z" 
                        fill="url(#chartGrad)" 
                      />

                      {/* Main Stroke */}
                      <path 
                        d="M 0 150 L 50 130 L 100 80 L 150 110 L 200 60 L 250 120 L 300 45 L 350 90 L 400 30 L 450 70 L 500 50" 
                        fill="none" 
                        stroke="#5d753e" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Sparkle Nodes */}
                      <circle cx="200" cy="60" r="4" fill="#3f5328" />
                      <circle cx="300" cy="45" r="4" fill="#3f5328" />
                      <circle cx="400" cy="30" r="4" fill="#3f5328" />
                    </svg>

                    {/* Chart Tooltips */}
                    <div className="absolute top-4 left-6 px-2 py-1 rounded bg-accent-dark text-white text-[9px] font-bold shadow">
                      Pico: $65.000 (M.Libre)
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-text-tertiary px-1 font-mono">
                      <span>Inicio Periodo</span>
                      <span>Mitad de Mes</span>
                      <span>Fin Periodo</span>
                    </div>
                  </div>
                </div>

                {/* Custom Category Progress Bars */}
                <div className="rounded-3xl border border-border-primary bg-bg-secondary p-4 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary">Distribución de Gastos</h3>
                    <p className="text-[10px] text-text-secondary">Asignado automáticamente por algoritmo</p>
                  </div>

                  <div className="space-y-3.5">
                    {categoryStats.slice(0, 4).map(stat => (
                      <div key={stat.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-text-secondary flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              stat.name === "Alimentación" ? "bg-emerald-500" :
                              stat.name === "Transporte" ? "bg-amber-500" :
                              stat.name === "Servicios" ? "bg-indigo-500" :
                              stat.name === "Tecnología" ? "bg-purple-500" : "bg-text-disabled"
                            }`} />
                            {stat.name}
                          </span>
                          <span className="text-text-primary font-mono">${stat.value.toLocaleString("es-AR")} ({stat.percentage}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg-primary overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              stat.name === "Alimentación" ? "bg-emerald-500" :
                              stat.name === "Transporte" ? "bg-amber-500" :
                              stat.name === "Servicios" ? "bg-indigo-500" :
                              stat.name === "Tecnología" ? "bg-purple-500" : "bg-text-disabled"
                            }`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── TRANSACTION LIST TABLE ── */}
              <div className="rounded-3xl border border-border-primary bg-bg-secondary p-4 sm:p-6 shadow-sm space-y-4">
                
                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border-secondary">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Historial de Movimientos Analizados</h3>
                    <p className="text-[10px] text-text-secondary mt-0.5">Mostrando {filteredTxList.length} de {displayStatement.transactions.length} transacciones</p>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:flex-initial min-w-[140px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar movimiento..." 
                        className="h-9 pl-9 pr-4 rounded-xl border border-border-primary bg-bg-primary text-xs outline-none focus:border-accent w-full sm:w-44"
                      />
                    </div>

                    {/* Category filter */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-border-primary bg-bg-primary text-xs outline-none focus:border-accent text-text-secondary cursor-pointer flex-1 sm:flex-initial min-w-[120px]"
                    >
                      <option value="all">Todas las Categorías</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Entretenimiento">Entretenimiento</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Otros">Otros</option>
                    </select>

                    {/* Type Filter */}
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as any)}
                      className="h-9 px-3 rounded-xl border border-border-primary bg-bg-primary text-xs outline-none focus:border-accent text-text-secondary cursor-pointer flex-1 sm:flex-initial min-w-[90px]"
                    >
                      <option value="all">Todos</option>
                      <option value="expenses">Gastos</option>
                      <option value="credits">Créditos/Pagos</option>
                    </select>

                    {/* Export */}
                    <button 
                      onClick={handleExportCSV}
                      className="h-9 px-3 rounded-xl bg-accent-soft hover:bg-accent-light/15 border border-accent-light/10 text-accent-dark font-bold text-xs flex items-center gap-1 flex-1 sm:flex-initial justify-center"
                      title="Exportar a CSV"
                    >
                      <Download className="w-3.5 h-3.5" /> Exportar
                    </button>
                  </div>
                </div>

                {/* Lluvia de Etiquetas (Tag Cloud) */}
                <div className="py-3 px-4 bg-bg-primary/50 rounded-2xl border border-border-secondary/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-accent-dark" /> Lluvia de Etiquetas (Filtrar rápido)
                    </span>
                    {selectedTag !== "all" && (
                      <button
                        onClick={() => setSelectedTag("all")}
                        className="text-[10px] font-bold text-accent-dark hover:underline"
                      >
                        Limpiar filtro
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => setSelectedTag("all")}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-150 ${
                        selectedTag === "all"
                          ? "bg-accent-dark text-white border-accent-dark shadow-sm"
                          : "bg-bg-secondary hover:bg-bg-tertiary border-border-secondary text-text-secondary"
                      }`}
                    >
                      Todos
                    </button>
                    
                    {getStatementTags().map((tag) => {
                      const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                      
                      let colorClasses = "";
                      if (isSelected) {
                        colorClasses = "bg-accent text-white border-accent shadow-sm";
                      } else {
                        const tagLower = tag.toLowerCase();
                        if (tagLower.includes("super") || tagLower.includes("coto") || tagLower.includes("comida")) {
                          colorClasses = "bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border-emerald-200/50";
                        } else if (tagLower.includes("delivery") || tagLower.includes("pedidos") || tagLower.includes("fastfood") || tagLower.includes("salidas")) {
                          colorClasses = "bg-orange-50/70 hover:bg-orange-100 text-orange-800 border-orange-200/50";
                        } else if (tagLower.includes("cine") || tagLower.includes("streaming") || tagLower.includes("música") || tagLower.includes("entretenimiento")) {
                          colorClasses = "bg-pink-50/70 hover:bg-pink-100 text-pink-800 border-pink-200/50";
                        } else if (tagLower.includes("combustible") || tagLower.includes("auto") || tagLower.includes("shell") || tagLower.includes("ypf") || tagLower.includes("axion")) {
                          colorClasses = "bg-amber-50/70 hover:bg-amber-100 text-amber-800 border-amber-200/50";
                        } else if (tagLower.includes("servicios") || tagLower.includes("luz") || tagLower.includes("gas") || tagLower.includes("internet") || tagLower.includes("telecom")) {
                          colorClasses = "bg-blue-50/70 hover:bg-blue-100 text-blue-800 border-blue-200/50";
                        } else if (tagLower.includes("viajes") || tagLower.includes("uber") || tagLower.includes("cabify") || tagLower.includes("sube")) {
                          colorClasses = "bg-teal-50/70 hover:bg-teal-100 text-teal-800 border-teal-200/50";
                        } else if (tagLower.includes("pago") || tagLower.includes("crédito")) {
                          colorClasses = "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300/50";
                        } else if (tagLower.includes("hogar") || tagLower.includes("muebles")) {
                          colorClasses = "bg-cyan-50/70 hover:bg-cyan-100 text-cyan-800 border-cyan-200/50";
                        } else if (tagLower.includes("mensual")) {
                          colorClasses = "bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 border-indigo-200/50";
                        } else {
                          colorClasses = "bg-bg-secondary hover:bg-bg-tertiary border-border-secondary text-text-secondary";
                        }
                      }

                      return (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 flex items-center gap-1 ${colorClasses}`}
                        >
                          #{tag}
                        </button>
                      );
                    })}

                    {getStatementTags().length === 0 && (
                      <span className="text-[11px] text-text-tertiary">
                        No hay etiquetas cargadas en esta tarjeta. Crea etiquetas usando el botón (+) en la tabla.
                      </span>
                    )}
                  </div>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-secondary text-text-tertiary font-bold">
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Descripción</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Monto</th>
                        <th className="py-3 px-4 text-right">Etiquetas (Tags)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxList.map((tx, idx) => {
                        const txKey = `${tx.description}-${idx}`;
                        const currentTags = transactionTags[txKey] || tx.tags;

                        return (
                          <tr key={txKey} className="border-b border-border-secondary hover:bg-bg-primary/30 transition-colors duration-150">
                            <td className="py-3.5 px-4 font-mono text-text-secondary">{tx.date}</td>
                            <td className="py-3.5 px-4 font-bold text-text-primary uppercase tracking-tight max-w-[180px] sm:max-w-[260px] truncate" title={tx.description}>{tx.description}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                tx.category === "Alimentación" ? "bg-emerald-50 text-emerald-700" :
                                tx.category === "Transporte" ? "bg-amber-50 text-amber-700" :
                                tx.category === "Servicios" ? "bg-indigo-50 text-indigo-700" :
                                tx.category === "Tecnología" ? "bg-purple-50 text-purple-700" : "bg-bg-primary text-text-secondary"
                              }`}>
                                {tx.category}
                              </span>
                            </td>
                            <td className={`py-3.5 px-4 font-bold font-mono text-sm ${tx.amount < 0 ? "text-red-600" : "text-emerald-700"}`}>
                              {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                            </td>
                            
                            {/* Interactive Editable Tags cell */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex flex-wrap gap-1 justify-end items-center">
                                {currentTags.map(tag => (
                                  <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-[9px] font-bold text-accent-dark">
                                    {tag}
                                    <button 
                                      onClick={() => handleRemoveTag(txKey, tag)}
                                      className="hover:text-red-500 font-bold ml-0.5"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                                
                                {editingTagIndex === idx ? (
                                  <div className="inline-flex items-center gap-1">
                                    <input 
                                      type="text" 
                                      value={newTagInput[txKey] || ""}
                                      onChange={(e) => setNewTagInput({
                                        ...newTagInput,
                                        [txKey]: e.target.value
                                      })}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddTag(txKey);
                                        if (e.key === "Escape") setEditingTagIndex(null);
                                      }}
                                      placeholder="Nuevo tag..."
                                      className="w-16 h-5 px-1 bg-white border border-border-primary rounded text-[9px] outline-none"
                                      autoFocus
                                    />
                                    <button 
                                      onClick={() => handleAddTag(txKey)}
                                      className="text-emerald-600 font-bold text-xs hover:scale-105"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setEditingTagIndex(idx)}
                                    className="p-1 rounded bg-bg-primary border border-border-secondary hover:border-accent text-text-tertiary hover:text-accent-dark transition-colors duration-200"
                                    title="Añadir etiqueta"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredTxList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-text-tertiary">
                            Ninguna transacción coincide con los filtros aplicados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-border-primary bg-bg-secondary p-12 text-center space-y-4 shadow-sm">
              <UploadCloud className="w-12 h-12 text-text-tertiary mx-auto opacity-50" />
              <div>
                <h3 className="text-base font-bold">Aún no has cargado ningún resumen</h3>
                <p className="text-xs text-text-secondary mt-1">Subí tu primer PDF de resumen de tarjeta de crédito para empezar a analizar tus gastos.</p>
              </div>
            </div>
          )}

        </div>

        {/* ── SIDE PANEL (RIGHT) ── */}
        <div className="space-y-6">
          
          {/* Unified Portfolio Summary card */}
          <div className="rounded-3xl border border-border-primary bg-bg-secondary p-4 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-secondary">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-accent-dark" /> Mi Portafolio Unificado
              </h3>
              <span className="text-[10px] font-bold bg-accent text-white px-2 py-0.5 rounded-full">
                {portfolio.length} Tarjeta(s)
              </span>
            </div>

            {/* Combined Totals */}
            {portfolio.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-secondary font-semibold">Deuda Total Consolidada</p>
                  <p className="text-2xl font-black text-text-primary font-mono">
                    ${portfolio.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-text-tertiary">Suma de todos los saldos totales a pagar.</p>
                </div>

                {/* Portfolio items list */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Tarjetas Unidas</p>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {portfolio.map(b => (
                      <div 
                        key={`${b.bankSlug}-${b.cardLastFour}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-bg-primary border border-border-secondary/80 text-xs hover:border-accent transition-colors duration-150"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold uppercase flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-accent-dark" />
                            {b.bankName}
                          </p>
                          <p className="text-[10px] text-text-tertiary uppercase">{b.cardType} • {b.cardLastFour}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-text-primary font-mono">${b.totalAmount.toLocaleString("es-AR")}</p>
                          <button 
                            onClick={() => handleRemoveFromPortfolio(b.bankSlug, b.cardLastFour)}
                            className="p-1 rounded text-text-tertiary hover:text-red-500 hover:bg-error-bg transition-colors duration-200"
                            title="Quitar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combined graph link trigger */}
                <div className="pt-2">
                  <button 
                    onClick={() => setShowPortfolio(!showPortfolio)}
                    className="w-full h-10 rounded-xl bg-bg-primary hover:bg-bg-tertiary border border-border-primary text-text-secondary font-bold text-xs transition-colors duration-150 flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-4 h-4" /> 
                    {showPortfolio ? "Volver a Tarjeta Individual" : "Mostrar Portafolio Unificado"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-text-tertiary text-xs">
                Aún no has agregado ninguna tarjeta a tu portafolio unificado. Usa el botón "Agregar al Portafolio" arriba.
              </div>
            )}
          </div>

          {/* Quick statement tip card */}
          <div className="rounded-3xl border border-accent/15 bg-accent-soft/30 p-5 space-y-3">
            <h4 className="text-xs font-bold text-accent-dark flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-accent" /> ¿Cómo funciona el extractor?
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              El extractor local de DEBO analiza el texto de los resúmenes PDF mediante patrones heurísticos de cada banco, extrayendo instantáneamente los consumos, cargos financieros, montos totales y vencimientos. No guardamos tus datos financieros, todo el procesamiento ocurre localmente y seguro en tu navegador.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
