// app/utils/salaryUtils.js

// --- Currency helpers ---
const CURRENCY_CODE_TO_SYMBOL_MAP = { GBP: '£', USD: '$', EUR: '€', INR: '₹' };

export function getCurrencySymbolFromCode(currencyCode) {
  const normalizedCurrencyCode = String(currencyCode ?? '').toUpperCase();
  return CURRENCY_CODE_TO_SYMBOL_MAP[normalizedCurrencyCode] || '£';
}

export function extractCurrencySymbolFromText(textContainingCurrencySymbol) {
  const currencySymbolMatch = String(textContainingCurrencySymbol ?? '').match(/[£$€₹]/);
  return currencySymbolMatch ? currencySymbolMatch[0] : null;
}

// --- Number formatting ---
export function parseNumberFromMixedInput(valueToConvertToNumber) {
  if (valueToConvertToNumber == null) return null;
  if (typeof valueToConvertToNumber === 'number') {
    return Number.isFinite(valueToConvertToNumber) ? valueToConvertToNumber : null;
  }
  const digitsDotMinusOnly = String(valueToConvertToNumber).replace(/[^\d.-]+/g, '').trim();
  const parsedNumber = Number(digitsDotMinusOnly);
  return Number.isFinite(parsedNumber) ? parsedNumber : null;
}

export function formatIntegerWithThousandsSeparators(numberToFormat) {
  const roundedInteger = Math.round(numberToFormat);
  return roundedInteger.toLocaleString('en-GB');
}

export function formatNumberToKNotation(numberToConvertToK) {
  const roundedThousands = Math.round(numberToConvertToK / 1000);
  return `${roundedThousands}k`;
}

// --- Period detection/labels ---
export function detectCompensationPeriodFromText(compensationText) {
  const lowerCasedText = String(compensationText ?? '').toLowerCase();
  if (/(?:per\s*)?(?:annum|year|yr|\/year)\b/.test(lowerCasedText)) return 'year';
  if (/(?:per\s*)?(?:week|\/week|weekly)\b/.test(lowerCasedText)) return 'week';
  if (/(?:per\s*)?(?:month|\/month|monthly)\b/.test(lowerCasedText)) return 'month';
  if (/(?:per\s*)?(?:day|\/day|daily)\b/.test(lowerCasedText)) return 'day';
  if (/(?:per\s*)?(?:hour|\/hour|hourly|hr)\b/.test(lowerCasedText)) return 'hour';
  return null;
}

export function humanReadablePeriodLabel(compensationPeriodKey) {
  switch (compensationPeriodKey) {
    case 'year': return 'Per Annum';
    case 'week': return 'Per Week';
    case 'month': return 'Per Month';
    case 'day': return 'Per Day';
    case 'hour': return 'Per Hour';
    default: return null;
  }
}

/**
 * Normalize salary from a job JSON object.
 * Returns { displayAmount, periodKey, periodLabel } or null if no salary info can be derived.
 */
export function normalizeSalary(jobJson) {
  const jobObject = jobJson || {};

  let minimumCompensationAmount = parseNumberFromMixedInput(
    jobObject.salary_min ?? jobObject.salaryMin ?? jobObject.compensation_min ?? jobObject.compensation?.min
  );
  let maximumCompensationAmount = parseNumberFromMixedInput(
    jobObject.salary_max ?? jobObject.salaryMax ?? jobObject.compensation_max ?? jobObject.compensation?.max
  );

  let compensationCurrencySymbol =
    jobObject.salary_currency_symbol ||
    extractCurrencySymbolFromText(jobObject.salary) ||
    getCurrencySymbolFromCode(jobObject.salary_currency || jobObject.currency || 'GBP');

  let rawCompensationPeriod =
    jobObject.salary_period ??
    jobObject.salaryPeriod ??
    jobObject.compensation_period ??
    jobObject.compensation?.period ??
    jobObject.salary_interval;

  let normalizedCompensationPeriodKey = rawCompensationPeriod ? String(rawCompensationPeriod).toLowerCase() : null;

  if (normalizedCompensationPeriodKey) {
    if (/^year|annum|annual/.test(normalizedCompensationPeriodKey)) normalizedCompensationPeriodKey = 'year';
    else if (/^week|weekly/.test(normalizedCompensationPeriodKey)) normalizedCompensationPeriodKey = 'week';
    else if (/^month|monthly/.test(normalizedCompensationPeriodKey)) normalizedCompensationPeriodKey = 'month';
    else if (/^day|daily/.test(normalizedCompensationPeriodKey)) normalizedCompensationPeriodKey = 'day';
    else if (/^hour|hr|hourly/.test(normalizedCompensationPeriodKey)) normalizedCompensationPeriodKey = 'hour';
    else normalizedCompensationPeriodKey = null;
  }

  if ((!minimumCompensationAmount && !maximumCompensationAmount) || !normalizedCompensationPeriodKey) {
    const freeTextCompensation = jobObject.salary || jobObject.compensation_text || '';
    if (freeTextCompensation) {
      if (!compensationCurrencySymbol) {
        compensationCurrencySymbol = extractCurrencySymbolFromText(freeTextCompensation) || compensationCurrencySymbol;
      }
      const numericTokens = (freeTextCompensation.match(/\d[\d,]*/g) || [])
        .map(tokenText => parseNumberFromMixedInput(tokenText))
        .filter(parsedNumber => parsedNumber != null);

      if (!minimumCompensationAmount && numericTokens[0] != null) minimumCompensationAmount = numericTokens[0];
      if (!maximumCompensationAmount && numericTokens[1] != null) maximumCompensationAmount = numericTokens[1];
      if (!normalizedCompensationPeriodKey) {
        normalizedCompensationPeriodKey = detectCompensationPeriodFromText(freeTextCompensation);
      }
    }
  }

  if (!minimumCompensationAmount && !maximumCompensationAmount) return null;

  let formattedDisplayAmountText = '';
  if (normalizedCompensationPeriodKey === 'year') {
    if (minimumCompensationAmount && maximumCompensationAmount) {
      formattedDisplayAmountText =
        `${compensationCurrencySymbol}${formatNumberToKNotation(minimumCompensationAmount)}-` +
        `${formatNumberToKNotation(maximumCompensationAmount)}`;
    } else if (minimumCompensationAmount) {
      formattedDisplayAmountText = `${compensationCurrencySymbol}${formatNumberToKNotation(minimumCompensationAmount)}`;
    } else if (maximumCompensationAmount) {
      formattedDisplayAmountText = `${compensationCurrencySymbol}${formatNumberToKNotation(maximumCompensationAmount)}`;
    }
  } else {
    if (minimumCompensationAmount && maximumCompensationAmount) {
      formattedDisplayAmountText =
        `${compensationCurrencySymbol}${formatIntegerWithThousandsSeparators(minimumCompensationAmount)}-` +
        `${compensationCurrencySymbol}${formatIntegerWithThousandsSeparators(maximumCompensationAmount)}`;
    } else if (minimumCompensationAmount) {
      formattedDisplayAmountText =
        `${compensationCurrencySymbol}${formatIntegerWithThousandsSeparators(minimumCompensationAmount)}`;
    } else if (maximumCompensationAmount) {
      formattedDisplayAmountText =
        `${compensationCurrencySymbol}${formatIntegerWithThousandsSeparators(maximumCompensationAmount)}`;
    }
  }

  return {
    displayAmount: formattedDisplayAmountText || null,
    periodKey: normalizedCompensationPeriodKey || null,
    periodLabel: humanReadablePeriodLabel(normalizedCompensationPeriodKey) || null
  };
}


