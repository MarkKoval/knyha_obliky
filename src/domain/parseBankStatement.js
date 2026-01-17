import ExcelJS from 'exceljs';

export default async function parseBankStatement(file) {
  const data = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(data);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Файл не містить аркушів');
  }
  const raw = [];
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    raw.push(row.values.slice(1));
  });
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
