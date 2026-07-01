export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav
        className="flex items-center justify-between w-full px-6 py-4 sm:px-10"
        style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-secondary)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "var(--color-apple-blue)" }}
          >
            D
          </div>
          <span className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
            DEBO
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/login" className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="text-sm font-medium px-5 py-2 rounded-full text-white transition-all hover:opacity-90"
            style={{ background: "var(--color-apple-blue)" }}
          >
            Registrarse
          </a>
        </div>
      </nav>

      {/* Hero Section — Full Viewport */}
      <section
        className="flex flex-col items-center justify-center w-full px-6 sm:px-10"
        style={{
          minHeight: "calc(100vh - 73px)",
          background: "linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)",
        }}
      >
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8 py-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: "var(--color-apple-blue)",
              backgroundImage: "linear-gradient(135deg, var(--color-apple-blue), var(--color-apple-blue-light))",
              color: "#fff",
            }}
          >
            <span>💰</span>
            <span>Finanzas personales inteligentes</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Tus{" "}
            <span style={{ color: "var(--color-apple-blue)" }}>finanzas</span>
            <br />
            simplificadas
          </h1>

          <p
            className="text-lg sm:text-xl leading-relaxed max-w-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Controla tus ingresos, gastos y presupuestos en un solo lugar.
            Diseñado con la simplicidad y elegancia de Apple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="/register"
              className="inline-flex h-14 px-10 items-center justify-center rounded-full text-white font-semibold text-base transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--color-apple-blue)" }}
            >
              Comenzar gratis
            </a>
            <a
              href="/about"
              className="inline-flex h-14 px-10 items-center justify-center rounded-full font-semibold text-base transition-all hover:scale-105 active:scale-95"
              style={{
                border: "1.5px solid var(--color-border-primary)",
                color: "var(--color-text-primary)",
                background: "var(--color-bg-primary)",
              }}
            >
              <span>Conocer más</span>
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="w-full px-6 sm:px-10 py-24"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Todo lo que necesitas
            </h2>
            <p className="text-lg max-w-lg mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Una plataforma completa para tomar el control de tu dinero.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                emoji: "📊",
                title: "Dashboard",
                desc: "Resumen claro de tu situación financiera en tiempo real con gráficos interactivos.",
              },
              {
                emoji: "💳",
                title: "Transacciones",
                desc: "Registra y categoriza cada movimiento con facilidad. Soporte multi-moneda.",
              },
              {
                emoji: "🎯",
                title: "Presupuestos",
                desc: "Define metas mensuales y recibe alertas inteligentes para no salirte del plan.",
              },
              {
                emoji: "📈",
                title: "Reportes",
                desc: "Visualiza tendencias, compara períodos y exporta tus datos a CSV.",
              },
              {
                emoji: "🏦",
                title: "Cuentas",
                desc: "Administra múltiples cuentas: débito, crédito, ahorro e inversiones.",
              },
              {
                emoji: "🔒",
                title: "Seguro",
                desc: "Tus datos financieros cifrados de extremo a extremo. Privacidad primero.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 p-8 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-secondary)",
                }}
              >
                <span className="text-4xl">{feature.emoji}</span>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="w-full px-6 sm:px-10 py-24 text-center"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            ¿Listo para empezar?
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Únete gratis y empieza a tomar el control de tus finanzas hoy.
          </p>
          <a
            href="/register"
            className="inline-flex h-14 px-12 items-center justify-center rounded-full text-white font-semibold text-base transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--color-apple-blue)" }}
          >
            Crear cuenta gratis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full px-6 sm:px-10 py-8 text-center text-sm border-t"
        style={{
          borderColor: "var(--color-border-secondary)",
          color: "var(--color-text-tertiary)",
          background: "var(--color-bg-secondary)",
        }}
      >
        <p>DEBO — Personal Finance App. Powered by Apple Design System.</p>
      </footer>
    </>
  );
}
