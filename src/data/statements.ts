export interface MockTransaction {
  date: string;
  description: string;
  amount: number; // Positive is expense, negative is credit/payment (or vice versa, let's keep it consistent: positive is payment/credit, negative is expense)
  category: "Alimentación" | "Transporte" | "Servicios" | "Entretenimiento" | "Tecnología" | "Otros";
  tags: string[];
}

export interface BankStatement {
  bankName: string;
  bankSlug: "galicia" | "santander" | "macro" | "nacion" | "bbva" | "naranja";
  cardType: "visa" | "mastercard" | "amex";
  cardLastFour: string;
  holderName: string;
  periodFrom: string;
  periodTo: string;
  dueDate: string;
  totalAmount: number; // in ARS
  minimumPayment: number; // in ARS
  previousBalance: number;
  paymentReceived: number;
  newCharges: number;
  interestCharges: number;
  otherCharges: number;
  transactions: MockTransaction[];
  rawText: string;
}

export const BANK_STATEMENTS: BankStatement[] = [
  {
    bankName: "Banco Galicia",
    bankSlug: "galicia",
    cardType: "mastercard",
    cardLastFour: "4821",
    holderName: "SANTIAGO GOMEZ",
    periodFrom: "2026-05-01",
    periodTo: "2026-05-31",
    dueDate: "2026-06-12",
    totalAmount: 185450.00,
    minimumPayment: 32000.00,
    previousBalance: 124000.00,
    paymentReceived: 124000.00,
    newCharges: 178950.00,
    interestCharges: 6500.00,
    otherCharges: 0.00,
    transactions: [
      { date: "2026-05-03", description: "SUPERMERCADOS COTO SA", amount: -42500.00, category: "Alimentación", tags: ["Super", "Mensual"] },
      { date: "2026-05-05", description: "SHELL ALMAGRO", amount: -15400.00, category: "Transporte", tags: ["Combustible", "Auto"] },
      { date: "2026-05-08", description: "NETFLIX ENTERTAINMENT", amount: -8900.00, category: "Entretenimiento", tags: ["Streaming", "Suscripción"] },
      { date: "2026-05-10", description: "TELECOM ARGENTINA SA", amount: -18500.00, category: "Servicios", tags: ["Internet", "Servicios"] },
      { date: "2026-05-12", description: "MERCADOLIBRE *TECHSTORE", amount: -65000.00, category: "Tecnología", tags: ["Cuotas", "Celular"] },
      { date: "2026-05-15", description: "RAPIPAGO *PAGO FACIL", amount: -12300.00, category: "Servicios", tags: ["Luz", "Gas"] },
      { date: "2026-05-18", description: "STALBUCKS CORRIENTES", amount: -4800.00, category: "Alimentación", tags: ["Cafetería", "Salidas"] },
      { date: "2026-05-20", description: "CABIFY ARGENTINA", amount: -6350.00, category: "Transporte", tags: ["Viajes", "App"] },
      { date: "2026-05-22", description: "SU PAGO EN PESOS - GRACIAS", amount: 124000.00, category: "Otros", tags: ["Pago", "Crédito"] },
      { date: "2026-05-25", description: "BURGER KING OBELISCO", amount: -5200.00, category: "Alimentación", tags: ["FastFood", "Salidas"] }
    ],
    rawText: `BANCO GALICIA - RESUMEN DE CUENTA
NRO TARJETA: **** **** **** 4821
TITULAR: SANTIAGO GOMEZ
PERIODO: 01/05/2026 AL 31/05/2026
VENCIMIENTO: 12/06/2026
SALDO ANTERIOR: $ 124.000,00
SU PAGO RECIBIDO: $ 124.000,00
NUEVOS CONSUMOS: $ 178.950,00
INTERESES FINANCIACION: $ 6.500,00
SALDO TOTAL A PAGAR: $ 185.450,00
PAGO MINIMO: $ 32.000,00

DETALLE DE CONSUMOS:
03/05/2026 SUPERMERCADOS COTO SA          $  42.500,00
05/05/2026 SHELL ALMAGRO                  $  15.400,00
08/05/2026 NETFLIX ENTERTAINMENT          $   8.900,00
10/05/2026 TELECOM ARGENTINA SA           $  18.500,00
12/05/2026 MERCADOLIBRE *TECHSTORE        $  65.000,00
15/05/2026 RAPIPAGO *PAGO FACIL           $  12.300,00
18/05/2026 STALBUCKS CORRIENTES           $   4.800,00
20/05/2026 CABIFY ARGENTINA               $   6.350,00
22/05/2026 SU PAGO EN PESOS - GRACIAS     $ 124.000,00-
25/05/2026 BURGER KING OBELISCO           $   5.200,00`
  },
  {
    bankName: "Banco Santander",
    bankSlug: "santander",
    cardType: "visa",
    cardLastFour: "9912",
    holderName: "MARIA BELEN DIAZ",
    periodFrom: "2026-05-02",
    periodTo: "2026-06-01",
    dueDate: "2026-06-10",
    totalAmount: 245100.00,
    minimumPayment: 48900.00,
    previousBalance: 198000.00,
    paymentReceived: 198000.00,
    newCharges: 245100.00,
    interestCharges: 0.00,
    otherCharges: 0.00,
    transactions: [
      { date: "2026-05-04", description: "EASY CASERTA", amount: -38400.00, category: "Otros", tags: ["Hogar", "Muebles"] },
      { date: "2026-05-06", description: "JUMBO PALERMO", amount: -58200.00, category: "Alimentación", tags: ["Super", "Mensual"] },
      { date: "2026-05-09", description: "SPOTIFY PREMIUM", amount: -2400.00, category: "Entretenimiento", tags: ["Música", "Suscripción"] },
      { date: "2026-05-12", description: "YPF SOLAR DE LA ABADIA", amount: -18900.00, category: "Transporte", tags: ["Combustible", "Auto"] },
      { date: "2026-05-14", description: "FARMACITY 105", amount: -11500.00, category: "Otros", tags: ["Farmacia", "Salud"] },
      { date: "2026-05-17", description: "MERCADOPAGO*SERVICIOS", amount: -22400.00, category: "Servicios", tags: ["Expensas", "Servicios"] },
      { date: "2026-05-20", description: "SAMSUNG WEBSTORE", amount: -82000.00, category: "Tecnología", tags: ["Monitor", "Trabajo"] },
      { date: "2026-05-24", description: "UBER *TRIP", amount: -4800.00, category: "Transporte", tags: ["Viajes", "App"] },
      { date: "2026-05-27", description: "SU PAGO DE RESUMEN", amount: 198000.00, category: "Otros", tags: ["Pago", "Crédito"] },
      { date: "2026-05-28", description: "PEDIDOSYA *PIZZA", amount: -6500.00, category: "Alimentación", tags: ["Delivery", "Salidas"] }
    ],
    rawText: `SANTANDER RIO - RESUMEN DE TARJETA DE CREDITO VISA
TITULAR: MARIA BELEN DIAZ
TARJETA NRO: **** **** **** 9912
PERIODO DESDE: 02/05/2026 HASTA: 01/06/2026
VTO: 10/06/2026
SALDO ANTERIOR: $ 198.000,00
SU PAGO: $ 198.000,00 (AGRADECEMOS SU PAGO)
NUEVOS CONSUMOS DE ESTE PERIODO: $ 245.100,00
CARGOS FINANCIEROS: $ 0,00
SALDO TOTAL: $ 245.100,00
PAGO MINIMO COMPULSORIO: $ 48.900,00

TRANSACCIONES DEL PERIODO:
04/05/2026 EASY CASERTA                      $ 38.400,00
06/05/2026 JUMBO PALERMO                     $ 58.200,00
09/05/2026 SPOTIFY PREMIUM                   $  2.400,00
12/05/2026 YPF SOLAR DE LA ABADIA            $ 18.900,00
14/05/2026 FARMACITY 105                     $ 11.500,00
17/05/2026 MERCADOPAGO*SERVICIOS             $ 22.400,00
20/05/2026 SAMSUNG WEBSTORE                  $ 82.000,00
24/05/2026 UBER *TRIP                        $  4.800,00
27/05/2026 SU PAGO DE RESUMEN                $ 198.000,00-
28/05/2026 PEDIDOSYA *PIZZA                  $  6.500,00`
  },
  {
    bankName: "Banco Macro",
    bankSlug: "macro",
    cardType: "amex",
    cardLastFour: "1155",
    holderName: "CARLOS ANDRES LOPEZ",
    periodFrom: "2026-05-03",
    periodTo: "2026-06-03",
    dueDate: "2026-06-15",
    totalAmount: 112300.00,
    minimumPayment: 19500.00,
    previousBalance: 87000.00,
    paymentReceived: 87000.00,
    newCharges: 107500.00,
    interestCharges: 4800.00,
    otherCharges: 0.00,
    transactions: [
      { date: "2026-05-05", description: "SUPERMERCADOS VEA 08", amount: -28500.00, category: "Alimentación", tags: ["Super", "Mensual"] },
      { date: "2026-05-08", description: "AXION SAN TELMO", amount: -11200.00, category: "Transporte", tags: ["Combustible", "Auto"] },
      { date: "2026-05-12", description: "SU PAGO EN PESOS", amount: 87000.00, category: "Otros", tags: ["Pago", "Crédito"] },
      { date: "2026-05-15", description: "COMPLEJO CINEMARK", amount: -5800.00, category: "Entretenimiento", tags: ["Cine", "Salidas"] },
      { date: "2026-05-20", description: "ADOBE CREATIVE CLOUD", amount: -15200.00, category: "Tecnología", tags: ["Software", "Trabajo"] },
      { date: "2026-05-23", description: "EDET TUCUMAN SA", amount: -21800.00, category: "Servicios", tags: ["Electricidad", "Servicios"] },
      { date: "2026-05-27", description: "HELADERIA LUCCIANOS", amount: -3900.00, category: "Alimentación", tags: ["Postres", "Salidas"] },
      { date: "2026-05-30", description: "SUBTE PASAJES", amount: -4100.00, category: "Transporte", tags: ["Viajes", "Sube"] }
    ],
    rawText: `BANCO MACRO - RESUMEN DE CUENTA AMERICAN EXPRESS
TITULAR: CARLOS ANDRES LOPEZ
NRO TARJETA: **** ****** *1155
PERIODO: DE 03/05/2026 A 03/06/2026
VTO: 15/06/2026
SALDO ANTERIOR: $ 87.000,00
PAGO REGISTRADO: $ 87.000,00
TOTAL DE NUEVOS CARGOS: $ 107.500,00
INTERESES CARGADOS: $ 4.800,00
TOTAL DE LA CUENTA PESOS: $ 112.300,00
PAGO MINIMO EXIGIBLE: $ 19.500,00

DETALLE DE TRANSACCIONES:
05/05/2026 SUPERMERCADOS VEA 08              $ 28.500,00
08/05/2026 AXION SAN TELMO                   $ 11.200,00
12/05/2026 SU PAGO EN PESOS                  $ 87.000,00-
15/05/2026 COMPLEJO CINEMARK                 $  5.800,00
20/05/2026 ADOBE CREATIVE CLOUD              $ 15.200,00
23/05/2026 EDET TUCUMAN SA                   $ 21.800,00
27/05/2026 HELADERIA LUCCIANOS               $  3.900,00
30/05/2026 SUBTE PASAJES                     $  4.100,00`
  },
  {
    bankName: "Banco Nación",
    bankSlug: "nacion",
    cardType: "visa",
    cardLastFour: "7432",
    holderName: "GABRIEL ESTEBAN RUIZ",
    periodFrom: "2026-05-05",
    periodTo: "2026-06-05",
    dueDate: "2026-06-18",
    totalAmount: 134200.00,
    minimumPayment: 22000.00,
    previousBalance: 98400.00,
    paymentReceived: 98400.00,
    newCharges: 134200.00,
    interestCharges: 0.00,
    otherCharges: 0.00,
    transactions: [
      { date: "2026-05-08", description: "CARREFOUR SAN MARTIN", amount: -49800.00, category: "Alimentación", tags: ["Super", "Comida"] },
      { date: "2026-05-11", description: "SU PAGO S/RESUMEN", amount: 98400.00, category: "Otros", tags: ["Pago", "Abono"] },
      { date: "2026-05-15", description: "YPF LA PLATA", amount: -14500.00, category: "Transporte", tags: ["Auto", "Nafta"] },
      { date: "2026-05-20", description: "PLAYSTATION NETWORK", amount: -18900.00, category: "Entretenimiento", tags: ["Consola", "Gaming"] },
      { date: "2026-05-25", description: "AYSA AGUA SA", amount: -11200.00, category: "Servicios", tags: ["Servicios", "Agua"] },
      { date: "2026-05-28", description: "COLEGIO INSCRIPCION", amount: -39800.00, category: "Otros", tags: ["Hijos", "Educación"] }
    ],
    rawText: `BANCO DE LA NACION ARGENTINA - RESUMEN DE VISA
SOCIOS: GABRIEL ESTEBAN RUIZ
VISA NRO: **** **** **** 7432
PERIODO: DESDE 05/05/2026 HASTA 06/06/2026
VTO: 18/06/2026
SALDO ANTERIOR PESOS: $ 98.400,00
SU PAGO DE ESTE PERIODO: $ 98.400,00
CONSUMOS DEL PERIODO: $ 134.200,00
CARGOS ADICIONALES: $ 0,00
NUEVO SALDO DEUDOR: $ 134.200,00
PAGO MINIMO COMPUTADO: $ 22.000,00

MOVIMIENTOS:
08/05/2026 CARREFOUR SAN MARTIN              $ 49.800,00
11/05/2026 SU PAGO S/RESUMEN                 $ 98.400,00-
15/05/2026 YPF LA PLATA                      $ 14.500,00
20/05/2026 PLAYSTATION NETWORK               $ 18.900,00
25/05/2026 AYSA AGUA SA                      $ 11.200,00
28/05/2026 COLEGIO INSCRIPCION               $ 39.800,00`
  },
  {
    bankName: "Naranja",
    bankSlug: "naranja",
    cardType: "mastercard",
    cardLastFour: "6370",
    holderName: "GABRIEL ESTEBAN RUIZ",
    periodFrom: "2026-05-01",
    periodTo: "2026-05-31",
    dueDate: "2026-06-15",
    totalAmount: 125450.00,
    minimumPayment: 28000.00,
    previousBalance: 85000.00,
    paymentReceived: 85000.00,
    newCharges: 125450.00,
    interestCharges: 0.00,
    otherCharges: 0.00,
    transactions: [
      { date: "2026-05-03", description: "COTO SAN JUSTO", amount: -22300.00, category: "Alimentación", tags: ["Super", "Comida"] },
      { date: "2026-05-07", description: "NETFLIX ARGENTINA", amount: -8900.00, category: "Entretenimiento", tags: ["Streaming", "Suscripción"] },
      { date: "2026-05-10", description: "MERCADOLIBRE *CELU", amount: -65000.00, category: "Tecnología", tags: ["Celular", "Cuotas"] },
      { date: "2026-05-14", description: "SU PAGO RESUMEN", amount: 85000.00, category: "Otros", tags: ["Pago", "Crédito"] },
      { date: "2026-05-18", description: "YPF RUTA 2", amount: -15200.00, category: "Transporte", tags: ["Auto", "Combustible"] },
      { date: "2026-05-22", description: "FARMACITY LOUNDRES", amount: -8950.00, category: "Otros", tags: ["Farmacia", "Salud"] },
      { date: "2026-05-26", description: "PEDIDOSYA *MCDONALDS", amount: -5100.00, category: "Alimentación", tags: ["Delivery", "FastFood"] }
    ],
    rawText: `NARANJA - RESUMEN DE TARJETA DE CREDITO
TITULAR: GABRIEL ESTEBAN RUIZ
TARJETA NRO: **** **** **** 6370
PERIODO: 01/05/2026 AL 31/05/2026
VENCIMIENTO: 15/06/2026
PAGO MINIMO: $ 28.000,00
PAGO TOTAL: $ 125.450,00
SALDO ANTERIOR: $ 85.000,00
PAGOS DEL PERIODO: $ 85.000,00

DETALLE DE MOVIMIENTOS:
03/05/2026 COTO SAN JUSTO                  $ 22.300,00
07/05/2026 NETFLIX ARGENTINA               $  8.900,00
10/05/2026 MERCADOLIBRE *CELU              $ 65.000,00
14/05/2026 SU PAGO RESUMEN                 $ 85.000,00-
18/05/2026 YPF RUTA 2                      $ 15.200,00
22/05/2026 FARMACITY LOUNDRES              $  8.950,00
26/05/2026 PEDIDOSYA *MCDONALDS            $  5.100,00`
  }
];

// Simple, high-precision parser logic in TS to mimic the backend parsers in real-time
export function parseStatementText(text: string, forceSlug?: "galicia" | "santander" | "macro" | "nacion" | "bbva" | "naranja" | null): BankStatement | null {
  const lowerText = text.toLowerCase();

  // Try to match the slug — use forceSlug if provided, otherwise auto-detect
  let detectedSlug: "galicia" | "santander" | "macro" | "nacion" | "bbva" | "naranja" | null = forceSlug || null;
  
  if (!detectedSlug) {
    if (lowerText.includes("galicia")) {
      detectedSlug = "galicia";
    } else if (lowerText.includes("santander")) {
      detectedSlug = "santander";
    } else if (lowerText.includes("macro") || lowerText.includes("american express")) {
      detectedSlug = "macro";
    } else if (lowerText.includes("naranja")) {
      detectedSlug = "naranja";
    } else if (lowerText.includes("nacion") || lowerText.includes("nación")) {
      detectedSlug = "nacion";
    } else if (lowerText.includes("bbva")) {
      detectedSlug = "bbva";
    }
  }

  // If we still can't detect the bank, return null
  if (!detectedSlug) return null;

  // Find standard fields using Regex (similar to python parsers)
  let cardType: "visa" | "mastercard" | "amex" = "visa";
  if (lowerText.includes("mastercard") || lowerText.includes("master")) {
    cardType = "mastercard";
  } else if (lowerText.includes("american express") || lowerText.includes("amex")) {
    cardType = "amex";
  }

  let cardLastFour = "0000";
  const cardMatch = text.match(/(?:\*{4}|\.{4}|\*{6})\s*(?:\*{4}|\.{4})\s*(?:\*{4}|\.{4}|\*{6})\s*(\d{4})/);
  const cardMatchAmex = text.match(/\*\s*(\d{4})/);
  if (cardMatch) {
    cardLastFour = cardMatch[1];
  } else if (cardMatchAmex) {
    cardLastFour = cardMatchAmex[1];
  } else {
    const lastFourAny = text.match(/tarjeta.*(\d{4})/i);
    if (lastFourAny) {
      cardLastFour = lastFourAny[1];
    }
  }

  let holderName = "USUARIO DEBO";
  const holderMatch = text.match(/(?:titular|socios|holder|nombre)[:\s]*([A-ZÁÉÍÓÚÜÑ\s]{3,40})/i);
  if (holderMatch) {
    holderName = holderMatch[1].trim().toUpperCase();
  }

  let periodFrom = "2026-05-01";
  let periodTo = "2026-05-31";
  const periodMatch = text.match(/(?:per[ií]odo|periodo|desde)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})(?:\s*(?:al|a|hasta|[-])\s*)(\d{2}[/-]\d{2}[/-]\d{4})/i);
  if (periodMatch) {
    // convert DD/MM/YYYY to YYYY-MM-DD
    const d1 = periodMatch[1].split(/[/-]/);
    const d2 = periodMatch[2].split(/[/-]/);
    if (d1.length === 3) periodFrom = `${d1[2]}-${d1[1]}-${d1[0]}`;
    if (d2.length === 3) periodTo = `${d2[2]}-${d2[1]}-${d2[0]}`;
  }

  let dueDate = "2026-06-12";
  const dueMatch = text.match(/(?:vencimiento|due\s*date|vto)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/i);
  if (dueMatch) {
    const d = dueMatch[1].split(/[/-]/);
    if (d.length === 3) dueDate = `${d[2]}-${d[1]}-${d[0]}`;
  }

  // Parse amounts
  const parseAmountVal = (valStr: string): number => {
    // replace dots with empty, and commas with dots
    const clean = valStr.replace(/\./g, "").replace(/,/g, ".").trim();
    return parseFloat(clean) || 0;
  };

  let totalAmount = 150000;
  const totalMatch = text.match(/(?:pago\s*total|total\s*a\s*pagar|saldo\s*total|saldo\s*total\s*a\s*pagar|nuevo\s*saldo\s*deudor)[:\s]*\$?\s*([\d.,\s]+)/i);
  if (totalMatch) {
    totalAmount = parseAmountVal(totalMatch[1]);
  }

  let minimumPayment = 30000;
  const minMatch = text.match(/(?:pago\s*m[ií]nimo|pago\s*m[ií]n\.?|pago\s*m[ií]nimo\s*computado)[:\s]*\$?\s*([\d.,\s]+)/i);
  if (minMatch) {
    minimumPayment = parseAmountVal(minMatch[1]);
  }

  let previousBalance = 100000;
  const prevMatch = text.match(/(?:saldo\s*anterior|saldo\s*ant\.?)[:\s]*\$?\s*([\d.,\s]+)/i);
  if (prevMatch) {
    previousBalance = parseAmountVal(prevMatch[1]);
  }

  let paymentReceived = previousBalance;
  const payMatch = text.match(/(?:pago\s*recibido|pago\s*acreditado|su\s*pago|pagos?\s*del\s*periodo|pago\s*registrado)[:\s]*\$?\s*([\d.,\s]+)/i);
  if (payMatch) {
    paymentReceived = parseAmountVal(payMatch[1]);
  }

  let interestCharges = 0;
  const intMatch = text.match(/(?:intereses|intereses\s*financiación|intereses\s*punitorios|intereses\s*cargados)[:\s]*\$?\s*([\d.,\s]+)/i);
  if (intMatch) {
    interestCharges = parseAmountVal(intMatch[1]);
  }

  // Parse transaction lines
  // Match lines like: 03/05/2026 DESCRIPTION  $ 42.500,00 or 03/05/2026 DESCRIPTION  42.500,00
  const lines = text.split("\n");
  const transactions: MockTransaction[] = [];
  const txRegex = /(\d{2}[/-]\d{2}[/-]\d{4})\s+([A-Z0-9\s*./-]+?)\s+\$?\s*([\d.,\s]+)(-?)/i;

  for (const line of lines) {
    const m = line.match(txRegex);
    if (m) {
      const dateStr = m[1];
      const parts = dateStr.split(/[/-]/);
      const isoDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "2026-05-01";
      const description = m[2].trim();
      let amount = parseAmountVal(m[3]);
      const isCredit = m[4] === "-" || description.toLowerCase().includes("gracias") || description.toLowerCase().includes("su pago");

      if (isCredit) {
        // dynamic positive for payments, but let's represent as positive in data
        amount = amount; 
      } else {
        // represented as negative for transactions/purchases
        amount = -amount;
      }

      // skip if amount is 0
      if (amount === 0) continue;

      // Assign categories based on keywords
      let category: "Alimentación" | "Transporte" | "Servicios" | "Entretenimiento" | "Tecnología" | "Otros" = "Otros";
      const descLower = description.toLowerCase();
      if (descLower.includes("coto") || descLower.includes("jumbo") || descLower.includes("vea") || descLower.includes("carrefour") || descLower.includes("burger") || descLower.includes("starbucks") || descLower.includes("pizza") || descLower.includes("pedidosya") || descLower.includes("comida") || descLower.includes("heladeria")) {
        category = "Alimentación";
      } else if (descLower.includes("shell") || descLower.includes("ypf") || descLower.includes("axion") || descLower.includes("cabify") || descLower.includes("uber") || descLower.includes("subte") || descLower.includes("sube") || descLower.includes("combustible")) {
        category = "Transporte";
      } else if (descLower.includes("telecom") || descLower.includes("netflix") || descLower.includes("spotify") || descLower.includes("rapipago") || descLower.includes("pago facil") || descLower.includes("aysa") || descLower.includes("luz") || descLower.includes("gas") || descLower.includes("edet")) {
        category = descLower.includes("netflix") || descLower.includes("spotify") ? "Entretenimiento" : "Servicios";
      } else if (descLower.includes("mercadolibre") || descLower.includes("techstore") || descLower.includes("samsung") || descLower.includes("adobe") || descLower.includes("playstation") || descLower.includes("gaming")) {
        category = descLower.includes("playstation") ? "Entretenimiento" : "Tecnología";
      }

      // assign some funny/relevant tags
      const tags: string[] = [category];
      if (descLower.includes("mensual")) tags.push("Mensual");
      if (Math.abs(amount) > 30000) tags.push("GastoMayor");
      if (isCredit) tags.push("Pago");

      transactions.push({
        date: isoDate,
        description,
        amount,
        category,
        tags
      });
    }
  }

  const finalStatement: BankStatement = {
    bankName: detectedSlug === "galicia" ? "Banco Galicia" : detectedSlug === "santander" ? "Banco Santander" : detectedSlug === "macro" ? "Banco Macro" : detectedSlug === "nacion" ? "Banco Nación" : detectedSlug === "naranja" ? "Naranja" : "BBVA",
    bankSlug: detectedSlug,
    cardType,
    cardLastFour,
    holderName,
    periodFrom,
    periodTo,
    dueDate,
    totalAmount,
    minimumPayment,
    previousBalance,
    paymentReceived,
    newCharges: transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0),
    interestCharges,
    otherCharges: 0,
    transactions: transactions.length > 0 ? transactions : [
      { date: "2026-05-05", description: "SUPERMERCADO EJEMPLO", amount: -12500, category: "Alimentación", tags: ["Super"] }
    ],
    rawText: text
  };

  return finalStatement;
}
