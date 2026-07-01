import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEBO — Personal Finance App",
  description: "Controla tus ingresos, gastos y presupuestos en un solo lugar. Diseñado con la simplicidad de Apple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased">
      <body style={{ background: "var(--color-bg-primary)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  );
}
