"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const summaryCards = [
  { title: "Saldo total", value: "$12,480", caption: "+8.4% vs. semana pasada" },
  { title: "Gastos este mes", value: "$3,750", caption: "Abonado a suscripciones y compras" },
  { title: "Meta de ahorro", value: "$8,200", caption: "82% completado" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)] px-6 py-12">
      <motion.div
        className="mx-auto max-w-6xl space-y-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <section className="rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-10 shadow-[0_30px_80px_rgba(9,30,66,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-avocado-dark)]">Panel de prueba</p>
              <h1 className="mt-3 text-4xl font-bold text-[var(--color-text-primary)]">Bienvenido a DEBO</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
                Este es el interior de la app. Usa el menú para explorar la información financiera de ejemplo.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--color-avocado-dark)] px-8 text-base font-semibold text-white transition hover:opacity-95"
              >
                Volver al inicio
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-8 text-base font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-secondary)] hover:opacity-95"
              >
                Salir
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <motion.div
              key={card.title}
              className="rounded-[28px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8"
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-avocado-dark)]">{card.title}</p>
              <p className="mt-4 text-4xl font-bold text-[var(--color-text-primary)]">{card.value}</p>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{card.caption}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1.2fr]">
          <motion.div
            className="rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8"
            whileHover={{ y: -4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-avocado-dark)]">Movimientos recientes</p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Pago luz", amount: "-$85.00", status: "Realizado" },
                { label: "Ingreso freelance", amount: "+$950.00", status: "Recibido" },
                { label: "Suscripción DAFO", amount: "-$29.00", status: "Programado" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl bg-[var(--color-bg-secondary)] px-5 py-4">
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{item.status}</p>
                  </div>
                  <p className="font-semibold text-[var(--color-text-primary)]">{item.amount}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-[32px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8"
            whileHover={{ y: -4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-avocado-dark)]">Tus categorías</p>
            <div className="mt-6 space-y-3">
              {[
                { label: "Alimentación", amount: "$980" },
                { label: "Transporte", amount: "$310" },
                { label: "Entretenimiento", amount: "$430" },
              ].map((category) => (
                <div key={category.label} className="flex items-center justify-between rounded-3xl bg-[var(--color-bg-secondary)] px-5 py-4">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{category.label}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{category.amount}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}
