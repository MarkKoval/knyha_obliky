import { Button, Card, Stack } from '@mui/material';
import ExcelJS from 'exceljs';

const headers = [
  'Дата операції',
  'Готівка',
  'Надходження безготівка',
  'Повернення',
  'Транзитні кошти',
  'Власні кошти',
  'Разом дохід'
];

const headerTitle =
  'КНИГА ОБЛІКУ ДОХОДІВ для платників єдиного податку 1,2,3 груп, які не є платниками ПДВ';

const numberFormatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const formatCell = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  if (typeof value === 'number') {
    return numberFormatter.format(value);
  }
  return value.toString();
};

export default function ExportButtons({ rows, disabled, documentYear }) {

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Книга');

    sheet.addRow(headers);
    sheet.getRow(1).font = { bold: true };

    rows.forEach((row) => {
      const rowData = [
        row.date,
        row.cash,
        row.nonCash,
        row.refund,
        row.transit,
        row.own,
        row.total
      ];
      const excelRow = sheet.addRow(rowData);
      if (row.rowType === 'summary') {
        excelRow.font = { bold: true };
        excelRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1F4FF' }
        };
      }
    });

    sheet.columns.forEach((column) => {
      let max = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value?.toString() || '';
        max = Math.max(max, value.length + 2);
      });
      column.width = max;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'income-book.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePdfPrint = () => {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      return;
    }

    const tableRows = rows
      .map((row) => {
        const cells = [
          row.date,
          row.cash,
          row.nonCash,
          row.refund,
          row.transit,
          row.own,
          row.total
        ];
        const rowClass = row.rowType === 'summary' ? 'summary-row' : '';
        const renderedCells = cells
          .map((cell) => `<td>${formatCell(cell)}</td>`)
          .join('');
        return `<tr class="${rowClass}">${renderedCells}</tr>`;
      })
      .join('');

    printWindow.document.write(`<!DOCTYPE html>
      <html lang="uk">
        <head>
          <meta charset="UTF-8" />
          <title>Книга обліку доходів</title>
          <style>
            body { font-family: "Segoe UI", Arial, sans-serif; margin: 24px; color: #0f172a; }
            h1 { font-size: 16px; margin: 0 0 4px; text-align: center; }
            h2 { font-size: 14px; margin: 0 0 16px; text-align: center; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #cbd5f5; padding: 6px 8px; text-align: right; }
            th:first-child, td:first-child { text-align: left; }
            th { background: #eef2ff; font-weight: 600; }
            .summary-row td { font-weight: 700; background: #f1f4ff; }
            @page { size: A4 landscape; margin: 18mm; }
          </style>
        </head>
        <body>
          <h1>${headerTitle}</h1>
          <h2>на ${documentYear} рік</h2>
          <table>
            <thead>
              <tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>
            window.onload = () => {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>`);
    printWindow.document.close();
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Button variant="contained" onClick={handleExcel} disabled={disabled}>
          Експорт у Excel
        </Button>
        <Button variant="outlined" onClick={handlePdfPrint} disabled={disabled}>
          Друк PDF
        </Button>
      </Stack>
    </Card>
  );
}
