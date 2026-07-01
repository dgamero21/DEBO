export default function Home() {
  return (
    <>
      {/* ═══ NAV ═══ */}
      <nav
        className="flex items-center justify-between w-full px-8 py-5 lg:px-16"
        style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-secondary)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "var(--color-apple-blue)" }}
          >
            D
          </div>
          <span className="text-2xl font-semibold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            DEBO
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="/login"
            className="text-base font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="text-base font-semibold px-6 py-2.5 rounded-full text-white transition-all hover:opacity-85 active:scale-95"
            style={{ background: "var(--color-apple-blue)" }}
          >
            Registrarse
          </a>
        </div>
      </nav>

      {/* ═══ HERO — Full Viewport ═══ */}
      <section
        className="flex flex-col items-center justify-center w-full px-8 lg:px-16"
        style={{
          minHeight: "calc(100vh - 82px)",
          background: "linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)",
        }}
      >
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto gap-10 py-24">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-base font-medium tracking-wide"
            style={{
              background: "linear-gradient(135deg, var(--color-apple-blue), var(--color-apple-blue-light))",
              color: "#fff",
            }}
          >
            <span className="text-xl">💰</span>
            <span>Finanzas personales inteligentes</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Tus{" "}
            <span style={{ color: "var(--color-apple-blue)" }}>finanzas</span>
            <br />
            simplificadas
          </h1>

          <p
            className="text-xl sm:text-2xl leading-relaxed max-w-2xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Controla tus ingresos, gastos y presupuestos en un solo lugar.
            Diseñado con la simplicidad y elegancia de Apple.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-2">
            <a
              href="/register"
              className="inline-flex h-16 px-12 items-center justify-center rounded-full text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--color-apple-blue)" }}
            >
              Comenzar gratis
            </a>
            <a
              href="/about"
              className="inline-flex h-16 px-12 items-center justify-center rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95"
              style={{
                border: "2px solid var(--color-border-primary)",
                color: "var(--color-text-primary)",
                background: "var(--color-bg-primary)",
              }}
            >
              Conocer más
              <span className="ml-2 text-xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section
        className="w-full px-8 lg:px-16 py-32"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Todo lo que necesitas
            </h2>
            <p
              className="text-xl sm:text-2xl max-w-xl mx-auto leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Una plataforma completa para tomar el control de tu dinero.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                className="flex flex-col gap-5 p-10 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-secondary)",
                }}
              >
                <span className="text-5xl">{feature.emoji}</span>
                <h3
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="w-full px-8 lg:px-16 py-32 text-center"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            ¿Listo para empezar?
          </h2>
          <p
            className="text-xl sm:text-2xl leading-relaxed max-w-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Únete gratis y empieza a tomar el control de tus finanzas hoy.
          </p>
          <a
            href="/register"
            className="inline-flex h-16 px-14 items-center justify-center rounded-full text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--color-apple-blue)" }}
          >
            Crear cuenta gratis
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="w-full px-8 lg:px-16 py-10 text-center border-t"
        style={{
          borderColor: "var(--color-border-secondary)",
          color: "var(--color-text-tertiary)",
          background: "var(--color-bg-secondary)",
        }}
      >
        <p className="text-base">DEBO — Personal Finance App. Powered by Apple Design System.</p>
      </footer>
    </>
  );
}
