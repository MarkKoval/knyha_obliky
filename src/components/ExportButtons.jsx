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

const titleText =
  'КНИГА ОБЛІКУ ДОХОДІВ для платників єдиного податку 1,2,3 груп, які не є платниками ПДВ';

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number') {
    return value.toLocaleString('uk-UA', { minimumFractionDigits: 2 });
  }
  return value.toString();
};

const buildTableHtml = (rows) =>
  rows
    .map((row) => {
      const cells = [
        row.date,
        row.cash,
        row.nonCash,
        row.refund,
        row.transit,
        row.own,
        row.total
      ].map((cell) => `<td>${formatValue(cell)}</td>`);
      const rowClass = row.rowType === 'summary' ? 'summary-row' : '';
      return `<tr class="${rowClass}">${cells.join('')}</tr>`;
    })
    .join('');

const openPdfWindow = ({ rows, year, autoPrint }) => {
  const printWindow = window.open('about:blank', '_blank');
  if (!printWindow) {
    return;
  }

  const html = `<!DOCTYPE html>
    <html lang="uk">
      <head>
        <meta charset="UTF-8" />
        <title>Книга обліку доходів</title>
        <style>
          body {
            font-family: "Arial", sans-serif;
            margin: 24px;
            color: #1f2933;
          }
          h1 {
            font-size: 16px;
            margin: 0;
            text-align: center;
          }
          h2 {
            font-size: 14px;
            margin: 4px 0 16px;
            text-align: center;
            font-weight: normal;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          th,
          td {
            border: 1px solid #d3d8e0;
            padding: 6px 8px;
            text-align: left;
          }
          th {
            background: #f3f5f9;
            font-weight: 600;
          }
          .summary-row {
            font-weight: 700;
            background: #f1f4ff;
          }
          @media print {
            body {
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <h1>${titleText}</h1>
        <h2>на ${year} рік</h2>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${buildTableHtml(rows)}
          </tbody>
        </table>
      </body>
    </html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  if (autoPrint) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
};

export default function ExportButtons({ rows, disabled, year, onReset }) {

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

  const handlePdfExport = () => {
    openPdfWindow({ rows, year, autoPrint: false });
  };

  const handlePdfPrint = () => {
    openPdfWindow({ rows, year, autoPrint: true });
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button color="inherit" onClick={onReset}>
            Очистити
          </Button>
        </Stack>
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
