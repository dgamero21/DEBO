"use client";

import { motion } from "framer-motion";
import ParallaxHero from "@/components/ParallaxHero";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    emoji: "📊",
    title: "Dashboard inteligente",
    desc: "Visualiza tus ingresos, gastos y metas con paneles listos para tomar decisiones.",
  },
  {
    emoji: "💸",
    title: "Control real de gastos",
    desc: "Clasifica cada movimiento y recibe alertas cuando te acerques a tu presupuesto.",
  },
  {
    emoji: "🧾",
    title: "Reportes automáticos",
    desc: "Genera reportes de rendimiento mensual y exporta resultados en segundos.",
  },
  {
    emoji: "📈",
    title: "Objetivos financieros",
    desc: "Define metas de ahorro y sigue tu progreso con notificaciones inteligentes.",
  },
  {
    emoji: "🏦",
    title: "Cuentas unificadas",
    desc: "Agrupa tarjetas, cuentas y ahorros en un solo lugar sin confusiones.",
  },
  {
    emoji: "🔒",
    title: "Seguridad premium",
    desc: "Cifrado de datos, acceso seguro y privacidad pensada para tu tranquilidad.",
  },
];

const stats = [
  { value: "Presupuestos", label: "Control de gastos" },
  { value: "Tags activos", label: "Clasificación automática" },
  { value: "Progreso", label: "Objetivos conectados" },
];

export default function Home() {
  return (
    <>
      <nav className="flex items-center justify-between w-full px-8 py-5 lg:px-16" style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-secondary)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--color-accent-dark)" }}>
            D
          </div>
          <div>
            <p className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              DEBO
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Finanzas app</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="/register" className="hidden rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-secondary)] md:inline-flex">
            Registrarse
          </a>
          <a href="#login" className="rounded-full bg-[var(--color-accent-dark)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95">
            Ingresar
          </a>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-[rgba(110,139,61,0.12)] blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-56 h-56 w-56 rounded-full bg-[rgba(93,182,62,0.14)] blur-3xl" />

        <section className="w-full px-8 lg:px-16 py-24" style={{ background: "var(--color-bg-secondary)" }}>
          <div className="mx-auto max-w-[1120px]">
            <ParallaxHero />
          </div>
        </section>

        <section className="w-full px-8 lg:px-16 py-24" style={{ background: "var(--color-bg-secondary)" }}>
          <ScrollReveal>
            <div className="mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.9fr] max-w-[1120px] items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} className="space-y-8">
              <span className="inline-flex rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-dark)]">
                Financiero, claro y rápido
              </span>

              <h1 className="max-w-3xl text-5xl sm:text-6xl font-bold leading-tight tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                La app financiera que da estilo y control a tu dinero.
              </h1>

              <p className="max-w-2xl text-xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Organiza tus ingresos, automatiza presupuestos y convierte cada movimiento en un plan claro. Todo desde una interfaz ligera, profesional y diseñada para ahorrar tiempo.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#login" className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--color-accent-dark)] px-8 text-lg font-semibold text-white transition hover:opacity-95">
                  Ingresar ahora
                </a>
                <a href="/register" className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-8 text-lg font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-secondary)]">
                  Crear cuenta gratis
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 text-left">
                  <p className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>Presupuestos</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Define y sigue tus metas mensuales</p>
                </div>
                <div className="rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 text-left">
                  <p className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>Tags</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Clasifica gastos automáticamente</p>
                </div>
                <div className="rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 text-left">
                  <p className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>Objetivos</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Visualiza tu progreso claramente</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }} className="relative">
              <div className="rounded-[40px] border border-[var(--color-border-secondary)] bg-white p-6 shadow-[0_40px_120px_rgba(35,47,15,0.1)]">
                <div className="flex items-center justify-between mb-6">
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-dark)]">Panel principal</span>
                  <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">DEBO Pro</span>
                </div>
                <div className="rounded-[28px] bg-[var(--color-bg-secondary)] p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">Saldo disponible</p>
                      <p className="text-3xl font-semibold" style={{ color: "var(--color-text-primary)" }}>$12,480</p>
                    </div>
                    <div className="rounded-3xl bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-dark)]">
                      Activo
                    </div>
                  </div>

                  <div className="mb-6 h-48 rounded-[28px] bg-[linear-gradient(135deg,rgba(93,182,62,0.12),transparent)] p-4">
                    <div className="mb-3 h-2 rounded-full bg-[var(--color-border-secondary)]" />
                    <div className="flex gap-2 items-end h-full">
                      <div className="h-20 w-full rounded-full bg-[linear-gradient(180deg,rgba(93,182,62,0.92),rgba(93,182,62,0.4))]" />
                      <div className="h-32 w-full rounded-full bg-[linear-gradient(180deg,rgba(110,139,61,0.95),rgba(110,139,61,0.4))]" />
                      <div className="h-24 w-full rounded-full bg-[linear-gradient(180deg,rgba(94,148,68,0.95),rgba(94,148,68,0.38))]" />
                      <div className="h-28 w-full rounded-full bg-[linear-gradient(180deg,rgba(93,182,62,0.96),rgba(93,182,62,0.3))]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-white p-4 shadow-sm border border-[var(--color-border-primary)]">
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Ingresos</p>
                      <p className="mt-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>$6,200</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm border border-[var(--color-border-primary)]">
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Gastos</p>
                      <p className="mt-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>$2,840</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-[rgba(93,182,62,0.16)] blur-2xl" />
              <div className="absolute -right-8 bottom-6 h-24 w-24 rounded-full bg-[rgba(110,139,61,0.2)] blur-2xl" />
            </motion.div>
          </div>
          </ScrollReveal>
        </section>

        <section id="features" className="w-full px-8 lg:px-16 py-24" style={{ background: "var(--color-bg-tertiary)" }}>
          <div className="mx-auto max-w-[1120px]">
            <ScrollReveal>
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] items-center mb-16">
                <div>
                <motion.h2
                  className="text-4xl sm:text-5xl font-bold tracking-tight"
                  style={{ color: "var(--color-text-primary)" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  Características que convierten números en decisiones.
                </motion.h2>
                <motion.p
                  className="mt-5 max-w-xl text-lg leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                >
                  DEBO te da una vista simple de tu flujo de caja, tus metas y tus prioridades con componentes claros y toda la información al alcance.
                </motion.p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {features.slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="rounded-[28px] border border-[var(--color-border-primary)] bg-white p-6 shadow-sm"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--color-accent-soft)] text-2xl">
                      {feature.emoji}
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            </ScrollReveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="rounded-[28px] bg-white p-8 text-center shadow-[0_24px_70px_rgba(14,30,37,0.08)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <p className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="resultados" className="w-full px-8 lg:px-16 py-24" style={{ background: "var(--color-bg-tertiary)" }}>
          <ScrollReveal>
          <div className="mx-auto max-w-[1120px] rounded-[40px] border border-[var(--color-border-secondary)] bg-white p-12 shadow-[0_40px_120px_rgba(35,47,15,0.08)]">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <motion.h2 className="text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
                  Convierte tu dinero en resultados reales.
                </motion.h2>
                <motion.p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.1 }}>
                  Controla el cierre de mes, analiza el comportamiento de tus ingresos y encuentra oportunidades de ahorro con una app fiable y moderna.
                </motion.p>
              </div>
              <motion.div className="grid gap-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.15 }}>
                <div className="rounded-3xl bg-[var(--color-accent-soft)] p-8">
                  <p className="text-3xl font-bold" style={{ color: "var(--color-accent-dark)" }}>48%</p>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">Ahorro promedio mensual</p>
                </div>
                <div className="rounded-3xl bg-[var(--color-bg-primary)] p-8">
                  <p className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>2x</p>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">Más visibilidad en tu efectivo</p>
                </div>
              </motion.div>
            </div>
          </div>
          </ScrollReveal>
        </section>

        <section id="login" className="w-full px-8 lg:px-16 py-24" style={{ background: "var(--color-bg-secondary)" }}>
          <div className="mx-auto max-w-[1120px] grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
              <p className="text-sm uppercase tracking-[0.24em] font-semibold text-[var(--color-accent-dark)]">Inicio de sesión rápido</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                DEBO — Ingresa y comienza a controlar tu dinero.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Accede a tu panel DEBO para medir consumos, alcanzar metas y ordenar etiquetas sin demoras.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <div className="rounded-[32px] border border-[var(--color-border-secondary)] bg-white p-10 shadow-[0_40px_120px_rgba(35,47,15,0.08)]">
                <form className="space-y-6">
                  <div>
                    <label className="mb-3 block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      Correo electrónico
                    </label>
                    <input type="email" placeholder="tú@correo.com" className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current" style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }} />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      Contraseña
                    </label>
                    <input type="password" placeholder="********" className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current" style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }} />
                  </div>
                  <div className="flex items-center justify-between text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 accent-[var(--color-accent-dark)] rounded" />
                      Recordarme
                    </label>
                    <a href="/forgot" className="font-semibold" style={{ color: "var(--color-accent-dark)" }}>
                      Olvidé mi contraseña
                    </a>
                  </div>
                  <button type="button" className="w-full rounded-3xl bg-[var(--color-accent-dark)] px-6 py-4 text-lg font-semibold text-white transition hover:opacity-95">
                    Ingresar
                  </button>
                </form>
                <p className="mt-6 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  ¿No tienes cuenta? <a href="/register" className="font-semibold" style={{ color: "var(--color-accent-dark)" }}>Crear cuenta</a>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="w-full px-8 lg:px-16 py-10 text-center border-t" style={{ borderColor: "var(--color-border-secondary)", color: "var(--color-text-tertiary)", background: "var(--color-bg-secondary)" }}>
        <p className="text-base">DEBO — Finanzas personales con foco en consumo, metas y etiquetas.</p>
      </footer>
    </>
  );
}
