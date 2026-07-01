"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !bgRef.current || !accentRef.current || !statsRef.current || !chipsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { y: 0, opacity: 0.35, scale: 1.1 },
        {
          y: -90,
          opacity: 1,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        accentRef.current,
        { y: 0, opacity: 0.7, scale: 1 },
        {
          y: -180,
          opacity: 0.35,
          scale: 1.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        chipsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative overflow-hidden rounded-[48px] bg-[var(--color-bg-primary)] px-8 py-10 shadow-[0_60px_120px_rgba(17,27,10,0.12)]">
      <div ref={bgRef} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(93,182,62,0.22),transparent_35%)]" />
      <div ref={accentRef} className="pointer-events-none absolute -right-24 top-20 h-48 w-48 rounded-full bg-[rgba(110,139,61,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute left-10 top-16 h-28 w-28 rounded-full bg-[rgba(53,103,32,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute right-16 bottom-24 h-32 w-32 rounded-full bg-[rgba(93,182,62,0.16)] blur-3xl" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-dark)]">
            Logros, metas y tags en una sola vista
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Una pantalla inicial que ya parece un dashboard.
          </h2>
          <p className="max-w-xl text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Mide consumos, define objetivos y controla etiquetas con animaciones de scroll y gráficos que dan sensación de movimiento.
          </p>

          <div ref={chipsRef} className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Tags activos", value: "34" },
              { label: "Ahorro meta", value: "78%" },
              { label: "Alertas", value: "3" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-4">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[40px] border border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)] p-6 shadow-[0_30px_90px_rgba(35,47,15,0.08)]">
          <div className="grid gap-4">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(110,139,61,0.08),transparent)] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">Balance disponible</p>
                  <p className="mt-2 text-3xl font-semibold" style={{ color: "var(--color-text-primary)" }}>$12.480</p>
                </div>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-dark)]">
                  Flujo
                </span>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Ingresos", amount: "$6.210", percent: 72 },
                  { label: "Gastos", amount: "$2.840", percent: 48 },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
                      <span>{metric.label}</span>
                      <span>{metric.amount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-border-secondary)]">
                      <div className="h-full rounded-full bg-[var(--color-accent-dark)]" style={{ width: `${metric.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div ref={statsRef} className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Objetivo ahorro", value: "+24%" },
                { label: "Etiquetas en tiempo", value: "93%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(35,47,15,0.05)] border border-[var(--color-border-primary)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">{stat.label}</p>
                  <p className="mt-4 text-3xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -left-7 top-10 h-24 w-24 rounded-full bg-[rgba(110,139,61,0.12)] blur-3xl" />
          <div className="absolute right-6 bottom-10 h-20 w-20 rounded-full bg-[rgba(93,182,62,0.12)] blur-3xl" />
        </div>
      </div>
    </div>
  );
}
