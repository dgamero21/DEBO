import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans" style={{ background: "var(--color-bg-secondary)" }}>
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-24 px-8 sm:px-16" style={{ background: "var(--color-bg-primary)" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-16 self-start">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: "var(--color-apple-blue)" }}>
            D
          </div>
          <span className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>DEBO</span>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Tu <span style={{ color: "var(--color-apple-blue)" }}>finanzas personales</span>, simplificadas
          </h1>
          <p className="text-lg leading-relaxed max-w-lg" style={{ color: "var(--color-text-secondary)" }}>
            Controla tus ingresos, gastos y presupuestos en un solo lugar. 
            Diseñado con la simplicidad y elegancia de Apple.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              className="inline-flex h-12 px-8 items-center justify-center rounded-full text-white font-medium transition-all hover:opacity-90"
              style={{ background: "var(--color-apple-blue)" }}
              href="/login"
            >
              Comenzar gratis
            </a>
            <a
              className="inline-flex h-12 px-8 items-center justify-center rounded-full font-medium transition-all"
              style={{
                border: "1px solid var(--color-border-primary)",
                color: "var(--color-text-primary)"
              }}
              href="/about"
            >
              Conocer más
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-24 mb-16">
          {[
            {
              emoji: "📊",
              title: "Dashboard",
              desc: "Resumen claro de tu situación financiera en tiempo real"
            },
            {
              emoji: "💳",
              title: "Transacciones",
              desc: "Registra y categoriza cada movimiento con facilidad"
            },
            {
              emoji: "🎯",
              title: "Presupuestos",
              desc: "Define metas mensuales y recibe alertas inteligentes"
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 p-6 rounded-2xl transition-all hover:-translate-y-1"
              style={{
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-secondary)"
              }}
            >
              <span className="text-3xl">{feature.emoji}</span>
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="w-full pt-8 border-t text-center text-sm" style={{ borderColor: "var(--color-border-secondary)", color: "var(--color-text-tertiary)" }}>
          <p>DEBO — Personal Finance App. Powered by Apple Design System.</p>
        </footer>
      </main>
    </div>
  );
}
