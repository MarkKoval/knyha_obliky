import { Button, Card, Stack } from '@mui/material';
import ExcelJS from 'exceljs';
import html2pdf from 'html2pdf.js';

const headers = [
  'Дата операції',
  'Готівка',
  'Надходження безготівка',
  'Повернення',
  'Транзитні кошти',
  'Власні кошти',
  'Разом дохід'
];

export default function ExportButtons({ rows, disabled }) {
  const getDocumentYear = () => {
    const rowWithDate = rows.find((row) => row.rawDate instanceof Date);
    return rowWithDate ? rowWithDate.rawDate.getFullYear() : new Date().getFullYear();
  };

  const buildPdfTable = () => {
    const container = document.createElement('div');
    const year = getDocumentYear();
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';

    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.innerHTML = `
      <div style="font-weight:700;">
        КНИГА ОБЛІКУ ДОХОДІВ для платників єдиного податку 1,2,3 груп, які не є платниками ПДВ
      </div>
      <div>на ${year} рік</div>
    `;

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.pageBreakInside = 'auto';
    table.style.breakInside = 'auto';
    table.innerHTML = `
      <thead>
        <tr>
          ${headers
            .map(
              (header) =>
                `<th style="border:1px solid #ddd;padding:6px;background:#f1f4ff;text-align:left;">${header}</th>`
            )
            .join('')}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((row) => {
            const isSummary = row.rowType === 'summary';
            return `
              <tr style="${isSummary ? 'font-weight:700;background:#f1f4ff;' : ''}page-break-inside:avoid;break-inside:avoid;">
                <td style="border:1px solid #ddd;padding:6px;">${row.date}</td>
                <td style="border:1px solid #ddd;padding:6px;">${row.cash}</td>
                <td style="border:1px solid #ddd;padding:6px;">${row.nonCash}</td>
                <td style="border:1px solid #ddd;padding:6px;">${row.refund}</td>
                <td style="border:1px solid #ddd;padding:6px;">${row.transit}</td>
                <td style="border:1px solid #ddd;padding:6px;">${row.own}</td>
                <td style="border:1px solid #ddd;padding:6px;">${row.total}</td>
              </tr>
            `;
          })
          .join('')}
      </tbody>
    `;

    container.append(header, table);
    return container;
  };

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

  const handlePdf = async () => {
    const table = buildPdfTable();

    await html2pdf()
      .set({
        margin: 10,
        filename: 'income-book.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape' }
      })
      .from(table)
      .save();
  };

  const handlePrint = async () => {
    const table = buildPdfTable();
    const pdf = await html2pdf()
      .set({
        margin: 10,
        filename: 'income-book.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape' }
      })
      .from(table)
      .toPdf()
      .get('pdf');

    if (pdf?.autoPrint) {
      pdf.autoPrint();
    }

    const blobUrl = pdf.output('bloburl');
    const printWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
      printWindow.onafterprint = () => {
        URL.revokeObjectURL(blobUrl);
        printWindow.close();
      };
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        iframe.remove();
      }, 1000);
    };
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Button variant="contained" onClick={handleExcel} disabled={disabled}>
          Експорт у Excel
        </Button>
        <Button variant="outlined" onClick={handlePdf} disabled={disabled}>
          Експорт у PDF
        </Button>
        <Button variant="outlined" onClick={handlePrint} disabled={disabled}>
          Друк
        </Button>
      </Stack>
    </Card>
  );
}
