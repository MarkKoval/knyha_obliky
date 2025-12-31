import {
  getMonth,
  getQuarter,
  getYear,
  isSameMonth,
  isSameQuarter
} from 'date-fns';
import {
  getMonthSummaryLabel,
  getQuarterSummaryLabel,
  getTwoQuarterSummaryLabel,
  getHalfYearSummaryLabel,
  getNineMonthSummaryLabel,
  getYearSummaryLabel
} from '../utils/periodHelpers.js';

function buildSummaryRow({ label, amount, id, rawDate }) {
  return {
    id,
    date: label,
    cash: '',
    nonCash: amount,
    refund: '',
    transit: '',
    own: '',
    total: amount,
    rowType: 'summary',
    rawDate
  };
}

export default function buildSummaries(rows) {
  if (!rows.length) {
    return [];
  }

  const result = [];
  let monthTotal = 0;
  let quarterTotal = 0;
  let halfTotal = 0;
  let twoQuarterTotal = 0;
  let nineMonthTotal = 0;
  let yearTotal = 0;

  rows.forEach((row, index) => {
    const date = row.rawDate;
    const next = rows[index + 1];
    monthTotal += row.total;
    quarterTotal += row.total;
    halfTotal += row.total;
    twoQuarterTotal += row.total;
    nineMonthTotal += row.total;
    yearTotal += row.total;

    result.push(row);

    const isEndOfMonth = !next || !isSameMonth(date, next.rawDate);
    const isEndOfQuarter = !next || !isSameQuarter(date, next.rawDate);
    const isEndOfHalf = !next || Math.floor(getMonth(date) / 6) !== Math.floor(getMonth(next.rawDate) / 6);
    const isEndOfNineMonth = isEndOfMonth && getMonth(date) === 8;
    const isEndOfYear = !next || getYear(date) !== getYear(next.rawDate);

    if (isEndOfMonth) {
      result.push(
        buildSummaryRow({
          label: getMonthSummaryLabel(date),
          amount: monthTotal,
          id: `${row.id}-month-summary`,
          rawDate: date
        })
      );
      monthTotal = 0;
    }

    if (isEndOfQuarter) {
      result.push(
        buildSummaryRow({
          label: getQuarterSummaryLabel(date),
          amount: quarterTotal,
          id: `${row.id}-quarter-summary`,
          rawDate: date
        })
      );
      quarterTotal = 0;
    }

    if (isEndOfQuarter && (getQuarter(date) === 2 || getQuarter(date) === 4)) {
      result.push(
        buildSummaryRow({
          label: getTwoQuarterSummaryLabel(date),
          amount: twoQuarterTotal,
          id: `${row.id}-two-quarter-summary`,
          rawDate: date
        })
      );
      twoQuarterTotal = 0;
    }

    if (isEndOfHalf) {
      result.push(
        buildSummaryRow({
          label: getHalfYearSummaryLabel(date),
          amount: halfTotal,
          id: `${row.id}-half-summary`,
          rawDate: date
        })
      );
      halfTotal = 0;
    }

    if (isEndOfNineMonth) {
      result.push(
        buildSummaryRow({
          label: getNineMonthSummaryLabel(date),
          amount: nineMonthTotal,
          id: `${row.id}-nine-summary`,
          rawDate: date
        })
      );
      nineMonthTotal = 0;
    }

    if (isEndOfYear) {
      result.push(
        buildSummaryRow({
          label: getYearSummaryLabel(date),
          amount: yearTotal,
          id: `${row.id}-year-summary`,
          rawDate: date
        })
      );
      yearTotal = 0;
      twoQuarterTotal = 0;
      nineMonthTotal = 0;
    }
  });

  return result;
}
