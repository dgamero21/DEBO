export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl rounded-[40px] border border-[var(--color-border-secondary)] bg-white p-10 shadow-[0_40px_100px_rgba(35,47,15,0.08)]">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">DEBO</p>
          <h1 className="mt-4 text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Inicio de sesión
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Accede a tu panel DEBO para medir consumos, alcanzar metas y ordenar etiquetas de forma clara.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tú@correo.com"
              className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current"
              style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current"
              style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-[var(--color-accent-dark)] rounded" />
              Recordarme
            </label>
            <a href="/forgot" className="font-semibold text-[var(--color-accent-dark)]">
              Olvidé mi contraseña
            </a>
          </div>

          <button type="button" className="w-full rounded-3xl bg-[var(--color-accent-dark)] px-6 py-4 text-lg font-semibold text-white transition hover:opacity-95">
            Ingresar
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
          ¿No tienes cuenta? <a href="/register" className="font-semibold text-[var(--color-accent-dark)]">Crear cuenta</a>
        </p>
      </div>
    </main>
  );
}
