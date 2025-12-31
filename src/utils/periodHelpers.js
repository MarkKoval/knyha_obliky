import { getMonth, getQuarter, getYear } from 'date-fns';

const monthNames = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень'
];

export function getMonthSummaryLabel(date) {
  const month = monthNames[getMonth(date)];
  return `Підсумок за ${month} ${getYear(date)}`;
}

export function getQuarterSummaryLabel(date) {
  const quarter = getQuarter(date);
  return `Підсумок за ${quarter} квартал ${getYear(date)}`;
}

export function getHalfYearSummaryLabel(date) {
  const half = getMonth(date) < 6 ? 1 : 2;
  return `Підсумок за ${half} півріччя ${getYear(date)}`;
}

export function getNineMonthSummaryLabel(date) {
  return `Підсумок за 9 місяців ${getYear(date)}`;
}

export function getYearSummaryLabel(date) {
  return `Підсумок за ${getYear(date)} рік`;
}
