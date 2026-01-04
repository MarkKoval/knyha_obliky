import { format } from 'date-fns';
import formatDate from '../utils/formatDate.js';
import normalizeNumber from '../utils/normalizeNumber.js';
import roundToCents from '../utils/roundToCents.js';

const keywords = ['надходження', 'зарахування'];
const creditMarkers = ['кредит', 'credit'];
const debitMarkers = ['дебет', 'debit'];

function hasMeaningfulValue(value) {
  return (
    value !== null &&
    value !== undefined &&
    (typeof value === 'number' || value.toString().trim() !== '')
  );
}

function isCreditRow(row) {
  if (Object.prototype.hasOwnProperty.call(row, 'Кредит')) {
    return hasMeaningfulValue(row['Кредит']);
  }

  const indicatorKey = Object.keys(row).find((key) =>
    /вид операц|тип операц|debit|credit|дебет|кредит/i.test(key)
  );

  if (indicatorKey) {
    const rawValue = row[indicatorKey];
    const textValue = rawValue ? rawValue.toString().toLowerCase() : '';
    if (creditMarkers.some((marker) => textValue.includes(marker))) {
      return true;
    }
    if (debitMarkers.some((marker) => textValue.includes(marker))) {
      return false;
    }
  }

  return true;
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 86400000);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = trimmed.match(
      /^(\d{1,2})[./](\d{1,2})[./](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/
    );
    if (match) {
      const [, day, month, year, hour = '0', minute = '0'] = match;
      const parsed = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      );
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

export default function buildIncomeBook(rawRows, mapping, options) {
  const grouped = new Map();
  const { groupByDay } = options;

  rawRows.forEach((row) => {
    if (!isCreditRow(row)) {
      return;
    }

    const dateValue = parseDateValue(row[mapping.date]);
    const amount = normalizeNumber(row[mapping.amount]);
    const description = mapping.description ? row[mapping.description] : '';
    const descriptionText = description ? description.toString().toLowerCase() : '';

    const isIncome = amount > 0 || keywords.some((keyword) => descriptionText.includes(keyword));
    if (!isIncome || !dateValue) {
      return;
    }

    const key = format(dateValue, 'yyyy-MM-dd');
    const formatted = formatDate(dateValue);

    if (groupByDay) {
      const existing = grouped.get(key) || {
        id: key,
        date: formatted,
        rawDate: dateValue,
        cash: '',
        nonCash: 0,
        refund: '',
        transit: '',
        own: '',
        total: 0
      };
      existing.nonCash = roundToCents(existing.nonCash + amount);
      existing.total = roundToCents(existing.total + amount);
      grouped.set(key, existing);
    } else {
      const id = `${key}-${grouped.size + 1}`;
      grouped.set(id, {
        id,
        date: formatted,
        rawDate: dateValue,
        cash: '',
        nonCash: roundToCents(amount),
        refund: '',
        transit: '',
        own: '',
        total: roundToCents(amount)
      });
    }
  });

  return Array.from(grouped.values()).sort((a, b) => a.rawDate - b.rawDate);
}
