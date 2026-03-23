/**
 * Currency Utils — Locale-based price display
 * Detects user's locale and converts USD to local currency for display
 */

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // Approximate exchange rate from USD
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  'en-IN': { code: 'INR', symbol: '₹', rate: 83 },
  'hi-IN': { code: 'INR', symbol: '₹', rate: 83 },
  'en-GB': { code: 'GBP', symbol: '£', rate: 0.79 },
  'en-AU': { code: 'AUD', symbol: 'A$', rate: 1.53 },
  'en-CA': { code: 'CAD', symbol: 'C$', rate: 1.36 },
  'de-DE': { code: 'EUR', symbol: '€', rate: 0.92 },
  'fr-FR': { code: 'EUR', symbol: '€', rate: 0.92 },
  'es-ES': { code: 'EUR', symbol: '€', rate: 0.92 },
  'it-IT': { code: 'EUR', symbol: '€', rate: 0.92 },
  'nl-NL': { code: 'EUR', symbol: '€', rate: 0.92 },
  'pt-BR': { code: 'BRL', symbol: 'R$', rate: 4.97 },
  'ja-JP': { code: 'JPY', symbol: '¥', rate: 149 },
  'zh-CN': { code: 'CNY', symbol: '¥', rate: 7.24 },
  'ko-KR': { code: 'KRW', symbol: '₩', rate: 1320 },
  'ar-AE': { code: 'AED', symbol: 'د.إ', rate: 3.67 },
  'ar-SA': { code: 'SAR', symbol: 'ر.س', rate: 3.75 },
};

// Fallback: map language prefix to common currency
const LANGUAGE_FALLBACK: Record<string, CurrencyInfo> = {
  'hi': { code: 'INR', symbol: '₹', rate: 83 },
  'de': { code: 'EUR', symbol: '€', rate: 0.92 },
  'fr': { code: 'EUR', symbol: '€', rate: 0.92 },
  'es': { code: 'EUR', symbol: '€', rate: 0.92 },
  'it': { code: 'EUR', symbol: '€', rate: 0.92 },
  'pt': { code: 'BRL', symbol: 'R$', rate: 4.97 },
  'ja': { code: 'JPY', symbol: '¥', rate: 149 },
  'zh': { code: 'CNY', symbol: '¥', rate: 7.24 },
  'ko': { code: 'KRW', symbol: '₩', rate: 1320 },
  'ar': { code: 'AED', symbol: 'د.إ', rate: 3.67 },
};

function getUserCurrency(): CurrencyInfo {
  if (typeof window === 'undefined') {
    return { code: 'USD', symbol: '$', rate: 1 };
  }

  const locale = navigator.language || 'en-US';

  // Exact match
  if (CURRENCY_MAP[locale]) {
    return CURRENCY_MAP[locale];
  }

  // Language prefix fallback
  const lang = locale.split('-')[0];
  if (LANGUAGE_FALLBACK[lang]) {
    return LANGUAGE_FALLBACK[lang];
  }

  // Default USD
  return { code: 'USD', symbol: '$', rate: 1 };
}

export function formatPrice(usdAmount: number): string {
  const currency = getUserCurrency();

  if (currency.code === 'USD') {
    return `$${usdAmount}`;
  }

  const converted = Math.round(usdAmount * currency.rate);

  // Format with locale-aware number formatting
  try {
    const formatted = new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
    return formatted;
  } catch {
    return `${currency.symbol}${converted.toLocaleString()}`;
  }
}

export function isUSD(): boolean {
  return getUserCurrency().code === 'USD';
}

export function getCurrencyCode(): string {
  return getUserCurrency().code;
}
