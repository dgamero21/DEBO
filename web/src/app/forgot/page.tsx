"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8 shadow-[0_30px_80px_rgba(9,30,66,0.08)]">
        <section className="space-y-4">
          <p className="inline-flex rounded-full bg-[var(--color-avocado-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-avocado-dark)]">
            Recuperar contraseña
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Restablece tu acceso
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Ingresa tu correo para recibir instrucciones y volver a entrar a tu aplicación de finanzas.
          </p>
        </section>

        <motion.section
          className="rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)] p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <form className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">Correo electrónico</label>
              <input
                type="email"
                placeholder="tú@correo.com"
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
              Enviar instrucciones
            </motion.button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
            <Link href="/login" className="font-semibold text-[var(--color-avocado-dark)] hover:opacity-90">
              Volver a iniciar sesión
            </Link>
            <Link href="/" className="font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              Volver a la página principal
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
