import { format } from 'date-fns';
import formatDate from '../utils/formatDate.js';
import normalizeNumber from '../utils/normalizeNumber.js';

const keywords = ['надходження', 'зарахування'];

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
    const creditValue = row['Кредит'];
    const hasCreditValue =
      creditValue !== null &&
      creditValue !== undefined &&
      (typeof creditValue === 'number' || creditValue.toString().trim() !== '');
    if (!hasCreditValue) {
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
      existing.nonCash += amount;
      existing.total += amount;
      grouped.set(key, existing);
    } else {
      const id = `${key}-${grouped.size + 1}`;
      grouped.set(id, {
        id,
        date: formatted,
        rawDate: dateValue,
        cash: '',
        nonCash: amount,
        refund: '',
        transit: '',
        own: '',
        total: amount
      });
    }
  });

  return Array.from(grouped.values()).sort((a, b) => a.rawDate - b.rawDate);
}
