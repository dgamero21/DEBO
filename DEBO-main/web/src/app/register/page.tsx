"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8 shadow-[0_30px_80px_rgba(9,30,66,0.08)]">
        <section className="space-y-4">
          <p className="inline-flex rounded-full bg-[var(--color-avocado-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-avocado-dark)]">
            Registro
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Empieza con DEBO
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Crea una cuenta nueva para gestionar tus ingresos, gastos y metas con un estilo limpio y confiable.
          </p>
        </section>

        <motion.section
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)] p-8">
            <div className="space-y-6">
              <motion.button
                type="button"
                className="w-full inline-flex items-center justify-center gap-3 rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-6 py-4 text-base font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-secondary)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-bold text-[var(--color-text-primary)] shadow-sm">
                  G
                </span>
                Registrarse con Gmail
              </motion.button>

              <div className="flex items-center gap-3 text-sm text-[var(--color-text-tertiary)]">
                <span className="h-px flex-1 bg-[var(--color-border-secondary)]" />
                <span>o</span>
                <span className="h-px flex-1 bg-[var(--color-border-secondary)]" />
              </div>
            </div>
            <form className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current"
                  style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tú@correo.com"
                  className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current"
                  style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">Contraseña</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded-3xl border px-4 py-4 text-base outline-none transition focus:border-current"
                  style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
                />
              </div>
              <motion.button
                type="button"
                className="w-full rounded-3xl bg-[var(--color-avocado-dark)] px-6 py-4 text-lg font-semibold text-white transition hover:opacity-95"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Crear cuenta
              </motion.button>
            </form>
          </div>

          <div className="flex flex-col justify-center gap-6 rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-avocado-dark)]">¿Ya tienes cuenta?</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--color-text-primary)]">Ingresa ahora</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
                Si ya estás registrado, inicia sesión en tu app para ver tu panel y controlar tu dinero.
              </p>
            </div>
            <Link href="/login" className="inline-flex h-16 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] px-8 text-lg font-semibold text-[var(--color-avocado-dark)] transition hover:opacity-95 border border-[var(--color-border-primary)]">
              Ir a iniciar sesión
            </Link>
            <Link href="/" className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              Volver a la página principal
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
