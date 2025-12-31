import * as XLSX from 'xlsx';

export default async function parseBankStatement(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Файл не містить аркушів');
  }
  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
  if (!raw.length) {
    throw new Error('Порожній файл');
  }

  const headers = raw[0].map((cell, index) =>
    cell ? cell.toString().trim() : `Колонка ${index + 1}`
  );

  const rows = raw.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? '';
    });
    return obj;
  });

  return { rows, columns: headers };
}
