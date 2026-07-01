import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Shield, 
  Tags, 
  Layers, 
  ArrowRight, 
  DollarSign, 
  FileText, 
  CheckCircle,
  HelpCircle,
  Lock
} from "lucide-react";

interface LandingViewProps {
  onNavigate: (view: "landing" | "login" | "register" | "forgot" | "dashboard") => void;
}

const features = [
  {
    icon: TrendingUp,
    title: "Dashboard inteligente",
    desc: "Visualiza tus ingresos, gastos y metas con paneles listos para tomar decisiones.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100"
  },
  {
    icon: DollarSign,
    title: "Control real de gastos",
    desc: "Clasifica cada movimiento y recibe alertas cuando te acerques a tu presupuesto.",
    color: "text-amber-600 bg-amber-50 border-amber-100"
  },
  {
    icon: FileText,
    title: "Reportes automáticos",
    desc: "Genera reportes de rendimiento mensual y exporta resultados en segundos.",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100"
  },
  {
    icon: CheckCircle,
    title: "Objetivos financieros",
    desc: "Define metas de ahorro y sigue tu progreso con notificaciones inteligentes.",
    color: "text-purple-600 bg-purple-50 border-purple-100"
  },
  {
    icon: Layers,
    title: "Cuentas unificadas",
    desc: "Agrupa tarjetas, cuentas y ahorros en un solo lugar sin confusiones.",
    color: "text-sky-600 bg-sky-50 border-sky-100"
  },
  {
    icon: Shield,
    title: "Seguridad premium",
    desc: "Cifrado de datos, acceso seguro y privacidad pensada para tu tranquilidad.",
    color: "text-accent-dark bg-accent-soft border-accent-light/20"
  }
];
const RAIN_ITEMS = [
  { text: "Sueldo", color: "bg-emerald-50/80 text-emerald-800 border-emerald-200/80", left: "4%", delay: "-4s", duration: 24, scale: 1.05, drift: "25px", rotStart: "-10deg", rotEnd: "15deg" },
  { text: "Supermercado", color: "bg-emerald-50/80 text-emerald-800 border-emerald-200/80", left: "14%", delay: "-18s", duration: 28, scale: 0.95, drift: "-15px", rotStart: "12deg", rotEnd: "-8deg" },
  { text: "Coto", color: "bg-emerald-50/80 text-emerald-800 border-emerald-200/80", left: "24%", delay: "-9s", duration: 22, scale: 0.9, drift: "20px", rotStart: "-5deg", rotEnd: "12deg" },
  { text: "Jumbo", color: "bg-emerald-50/80 text-emerald-800 border-emerald-200/80", left: "84%", delay: "-14s", duration: 26, scale: 1.0, drift: "-30px", rotStart: "8deg", rotEnd: "-12deg" },
  
  { text: "Delivery", color: "bg-orange-50/80 text-orange-800 border-orange-200/80", left: "8%", delay: "-11s", duration: 20, scale: 0.85, drift: "15px", rotStart: "-15deg", rotEnd: "10deg" },
  { text: "PedidosYa", color: "bg-orange-50/80 text-orange-800 border-orange-200/80", left: "32%", delay: "-2s", duration: 25, scale: 1.0, drift: "-20px", rotStart: "5deg", rotEnd: "-15deg" },
  { text: "Restaurantes", color: "bg-orange-50/80 text-orange-800 border-orange-200/80", left: "54%", delay: "-16s", duration: 23, scale: 1.1, drift: "10px", rotStart: "-8deg", rotEnd: "8deg" },
  { text: "Rappi", color: "bg-orange-50/80 text-orange-800 border-orange-200/80", left: "76%", delay: "-7s", duration: 21, scale: 0.9, drift: "-25px", rotStart: "15deg", rotEnd: "-5deg" },

  { text: "Netflix", color: "bg-pink-50/80 text-pink-800 border-pink-200/80", left: "19%", delay: "-23s", duration: 27, scale: 0.8, drift: "30px", rotStart: "-12deg", rotEnd: "12deg" },
  { text: "Cine", color: "bg-pink-50/80 text-pink-800 border-pink-200/80", left: "44%", delay: "-5s", duration: 31, scale: 0.95, drift: "-10px", rotStart: "10deg", rotEnd: "-10deg" },
  { text: "Spotify", color: "bg-pink-50/80 text-pink-800 border-pink-200/80", left: "68%", delay: "-15s", duration: 24, scale: 0.85, drift: "20px", rotStart: "-6deg", rotEnd: "14deg" },
  { text: "Entretenimiento", color: "bg-pink-50/80 text-pink-800 border-pink-200/80", left: "88%", delay: "-8s", duration: 29, scale: 1.15, drift: "-15px", rotStart: "14deg", rotEnd: "-14deg" },

  { text: "Suscripciones", color: "bg-indigo-50/80 text-indigo-800 border-indigo-200/80", left: "28%", delay: "-12s", duration: 33, scale: 1.05, drift: "-15px", rotStart: "-5deg", rotEnd: "10deg" },
  { text: "Gym", color: "bg-indigo-50/80 text-indigo-800 border-indigo-200/80", left: "59%", delay: "-20s", duration: 26, scale: 0.9, drift: "25px", rotStart: "8deg", rotEnd: "-8deg" },

  { text: "Uber", color: "bg-teal-50/80 text-teal-800 border-teal-200/80", left: "38%", delay: "-1s", duration: 19, scale: 0.9, drift: "10px", rotStart: "-10deg", rotEnd: "8deg" },
  { text: "Cabify", color: "bg-teal-50/80 text-teal-800 border-teal-200/80", left: "64%", delay: "-10s", duration: 23, scale: 1.0, drift: "-20px", rotStart: "12deg", rotEnd: "-12deg" },
  { text: "Viajes", color: "bg-teal-50/80 text-teal-800 border-teal-200/80", left: "93%", delay: "-17s", duration: 28, scale: 1.1, drift: "15px", rotStart: "-15deg", rotEnd: "15deg" },

  { text: "Combustible", color: "bg-amber-50/80 text-amber-800 border-amber-200/80", left: "49%", delay: "-13s", duration: 25, scale: 1.0, drift: "-10px", rotStart: "5deg", rotEnd: "-5deg" },
  { text: "Cafetería", color: "bg-amber-50/80 text-amber-800 border-amber-200/80", left: "72%", delay: "-4s", duration: 21, scale: 0.85, drift: "20px", rotStart: "-8deg", rotEnd: "8deg" },
  { text: "Starbucks", color: "bg-amber-50/80 text-amber-800 border-amber-200/80", left: "2%", delay: "-21s", duration: 27, scale: 0.8, drift: "15px", rotStart: "10deg", rotEnd: "-10deg" },

  { text: "Ropa", color: "bg-blue-50/80 text-blue-800 border-blue-200/80", left: "11%", delay: "-6s", duration: 29, scale: 0.95, drift: "-20px", rotStart: "-12deg", rotEnd: "12deg" },
  { text: "Tecnología", color: "bg-purple-50/80 text-purple-800 border-purple-200/80", left: "51%", delay: "-25s", duration: 32, scale: 1.1, drift: "25px", rotStart: "14deg", rotEnd: "-14deg" },
  { text: "Luz y Gas", color: "bg-blue-50/80 text-blue-800 border-blue-200/80", left: "81%", delay: "-15s", duration: 28, scale: 0.9, drift: "-15px", rotStart: "-8deg", rotEnd: "8deg" },
];

export default function LandingView({ onNavigate }: LandingViewProps) {
  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary selection:bg-accent-soft selection:text-accent-dark">
      {/* Custom Styles for Buttery-Smooth CSS Tag Rain */}
      <style>{`
        @keyframes tagRain {
          0% {
            transform: translateY(-120px) translateX(0) rotate(var(--rot-start));
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(calc(100vh + 120px)) translateX(var(--drift)) rotate(var(--rot-end));
            opacity: 0;
          }
        }
        .animate-tag-rain {
          animation: tagRain var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
      `}</style>

      {/* ── Lluvia de Tags Background Animation (Full Screen) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {RAIN_ITEMS.map((item, idx) => (
          <div
            key={`${item.text}-${idx}`}
            style={{
              position: "absolute",
              left: item.left,
              top: 0,
              transformScale: item.scale,
              transform: `scale(${item.scale})`,
              "--duration": `${item.duration}s`,
              "--delay": item.delay,
              "--drift": item.drift,
              "--rot-start": item.rotStart,
              "--rot-end": item.rotEnd,
            } as React.CSSProperties}
            className={`animate-tag-rain px-3.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-full border shadow-sm backdrop-blur-[1px] whitespace-nowrap select-none ${item.color}`}
          >
            #{item.text}
          </div>
        ))}
      </div>

      {/* ── Navigation ── */}
      <nav id="nav-landing" className="sticky top-0 z-50 flex items-center justify-between w-full px-6 py-4 md:px-12 bg-bg-primary/90 backdrop-blur-md border-b border-border-secondary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-accent-dark shadow-md">
            D
          </div>
          <div>
            <p className="text-lg font-semibold leading-none tracking-tight text-text-primary">DEBO</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mt-1">Finanzas Inteligentes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            id="btn-register-nav"
            onClick={() => onNavigate("register")} 
            className="hidden sm:inline-flex rounded-full border border-border-primary bg-bg-secondary px-5 py-2 text-sm font-semibold text-text-primary hover:bg-bg-tertiary transition-all duration-200"
          >
            Registrarse
          </button>
          <button 
            id="btn-login-nav"
            onClick={() => onNavigate("login")} 
            className="rounded-full bg-accent-dark px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition-all duration-200"
          >
            Ingresar
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="relative overflow-hidden">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute right-0 top-12 h-96 w-96 rounded-full bg-accent-light/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-48 h-80 w-80 rounded-full bg-accent-soft/30 blur-3xl" />

        <section id="hero" className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft border border-accent-light/20 px-4 py-1.5 text-xs font-semibold text-accent-dark">
                ✨ Extractor Automático de Resúmenes de Tarjeta
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-text-primary">
                La app financiera que da <span className="text-accent-dark underline decoration-accent-light decoration-wavy">estilo y control</span> a tu dinero.
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-xl">
                Organiza tus ingresos, automatiza presupuestos y extrae resúmenes bancarios de forma inmediata. Todo desde una interfaz ligera, profesional y diseñada para ahorrar tiempo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  id="btn-hero-dashboard"
                  onClick={() => onNavigate("dashboard")}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent-dark px-8 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:opacity-95"
                >
                  Probar Demo Gratis <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  id="btn-hero-register"
                  onClick={() => onNavigate("register")}
                  className="inline-flex h-14 items-center justify-center rounded-full border border-border-primary bg-bg-secondary px-8 text-base font-semibold text-text-primary transition-all duration-200 hover:bg-bg-tertiary"
                >
                  Crear Cuenta
                </button>
              </div>

              {/* Minimalist Grid Accents */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6">
                <div className="rounded-2xl border border-border-primary bg-bg-secondary/50 p-2 sm:p-4 text-center sm:text-left">
                  <p className="text-base sm:text-2xl font-bold text-text-primary">98.5%</p>
                  <p className="mt-1 text-[9px] sm:text-xs text-text-tertiary leading-tight">Precisión en OCR</p>
                </div>
                <div className="rounded-2xl border border-border-primary bg-bg-secondary/50 p-2 sm:p-4 text-center sm:text-left">
                  <p className="text-base sm:text-2xl font-bold text-text-primary">ARS/USD</p>
                  <p className="mt-1 text-[9px] sm:text-xs text-text-tertiary leading-tight">Soporte Multimoneda</p>
                </div>
                <div className="rounded-2xl border border-border-primary bg-bg-secondary/50 p-2 sm:p-4 text-center sm:text-left">
                  <p className="text-base sm:text-2xl font-bold text-text-primary">100%</p>
                  <p className="mt-1 text-[9px] sm:text-xs text-text-tertiary leading-tight">Seguro y Privado</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive App Preview Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-[36px] border border-border-primary bg-bg-secondary p-5 shadow-2xl relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-radial-gradient(circle_at_top,rgba(93,182,62,0.1),transparent_40%)" />
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-secondary">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-accent-dark bg-accent-soft px-3 py-1 rounded-full">
                    DEBO PRO PREVIEW
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Total Balance Card */}
                  <div className="rounded-2xl bg-bg-primary border border-border-secondary p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-text-secondary">Saldo Total Estimado</p>
                    <p className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">$185.450,00</p>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1.5 mt-3 text-[11px] sm:text-xs text-text-tertiary">
                      <span>Próximo Vto: 12/06/2026</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium self-start xs:self-auto">Banco Galicia</span>
                    </div>
                  </div>

                  {/* Micro Visual Chart Mock */}
                  <div className="rounded-2xl border border-border-secondary p-4 bg-bg-primary/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                      <span>Consumos por Categoría</span>
                      <span className="text-accent-dark">82% Presupuesto</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-text-tertiary">
                          <span>Alimentación (Coto, Jumbo)</span>
                          <span className="font-mono">$42.500</span>
                        </div>
                        <div className="h-2 rounded-full bg-border-secondary overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "65%" }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-text-tertiary">
                          <span>Tecnología (MercadoLibre)</span>
                          <span className="font-mono">$65.000</span>
                        </div>
                        <div className="h-2 rounded-full bg-border-secondary overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: "90%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini recent transactions table */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Últimos Consumos Extraídos</p>
                    <div className="space-y-2 max-h-[140px] overflow-hidden">
                      <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-bg-primary/70 border border-border-secondary/50">
                        <div>
                          <p className="font-semibold">MERCADOLIBRE *TECHSTORE</p>
                          <p className="text-[10px] text-text-tertiary">12/05/2026 • Tecnología</p>
                        </div>
                        <span className="font-semibold text-red-600 font-mono">-$65.000</span>
                      </div>
                      <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-bg-primary/70 border border-border-secondary/50">
                        <div>
                          <p className="font-semibold">NETFLIX ENTERTAINMENT</p>
                          <p className="text-[10px] text-text-tertiary">08/05/2026 • Suscripciones</p>
                        </div>
                        <span className="font-semibold text-red-600 font-mono">-$8.900</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background blurs */}
              <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-accent-light/10 blur-xl" />
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/15 blur-xl" />
            </motion.div>

          </div>
        </section>

        {/* ── Features Grid ── */}
        <section id="landing-features" className="w-full bg-bg-tertiary/40 border-t border-b border-border-secondary px-6 md:px-12 py-20">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
                Características que convierten números en decisiones.
              </h2>
              <p className="text-base text-text-secondary">
                DEBO te da una vista simple de tu flujo de caja, tus metas y tus prioridades con componentes claros y toda la información al alcance.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="rounded-3xl border border-border-primary bg-bg-secondary p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Interactive Results Section ── */}
        <section id="results" className="w-full px-4 sm:px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
          <div className="rounded-3xl sm:rounded-[40px] border border-border-primary bg-bg-secondary p-5 sm:p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-accent-soft/20 blur-3xl" />
            
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="space-y-5">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
                  Convierte tu dinero en resultados reales.
                </h2>
                <p className="text-base text-text-secondary leading-relaxed max-w-xl">
                  Controla el cierre de mes, analiza el comportamiento de tus ingresos y encuentra oportunidades de ahorro con una app fiable y moderna.
                </p>
                <div className="pt-2">
                  <button 
                    id="btn-results-demo"
                    onClick={() => onNavigate("dashboard")}
                    className="rounded-full bg-accent-dark text-white font-semibold px-6 py-3 text-sm flex items-center gap-1 hover:opacity-90 transition-all duration-200 shadow-sm"
                  >
                    Probar Extractor Ahora <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl bg-accent-soft border border-accent-light/10 p-6">
                  <p className="text-4xl font-bold text-accent-dark">48%</p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">Ahorro promedio mensual</p>
                  <p className="text-xs text-text-secondary mt-1">Usuarios que configuran objetivos y etiquetas mensuales logran mayor retención de capital.</p>
                </div>
                <div className="rounded-2xl bg-bg-primary border border-border-secondary p-6">
                  <p className="text-4xl font-bold text-text-primary">2x</p>
                  <p className="mt-2 text-sm font-semibold text-text-secondary">Más visibilidad de tu flujo de caja</p>
                  <p className="text-xs text-text-tertiary mt-1">Detección de suscripciones olvidadas y duplicación de cobros.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Simple Quick Access CTA ── */}
        <section id="cta" className="w-full bg-accent-dark text-white px-6 md:px-12 py-16 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Comienza a ordenar tus gastos hoy.</h2>
            <p className="text-accent-soft/80 text-sm md:text-base leading-relaxed">
              No dejes que los resúmenes incomprensibles te confundan. Sube tu PDF, obtén gráficos interactivos y toma decisiones fundamentadas al instante.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-4 pt-2">
              <button 
                id="btn-cta-dashboard"
                onClick={() => onNavigate("dashboard")}
                className="w-full xs:w-auto rounded-full bg-white text-accent-dark px-8 py-3 text-sm font-bold hover:bg-accent-soft transition-all duration-200 text-center"
              >
                Acceder al Dashboard
              </button>
              <button 
                id="btn-cta-register"
                onClick={() => onNavigate("register")}
                className="w-full xs:w-auto rounded-full bg-accent border border-accent-light/35 px-8 py-3 text-sm font-bold text-white hover:bg-accent-light/20 transition-all duration-200 text-center"
              >
                Crear Cuenta Gratis
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full px-6 py-10 text-center border-t border-border-primary bg-bg-secondary text-text-tertiary text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-accent-dark">
              D
            </div>
            <span className="font-bold text-text-primary text-base">DEBO</span>
          </div>
          <p>© 2026 DEBO Finanzas. Todos los derechos reservados. Diseñado bajo lineamientos Apple Design.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:underline">Privacidad</a>
            <a href="#" className="hover:underline">Términos</a>
            <a href="#" className="hover:underline">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
