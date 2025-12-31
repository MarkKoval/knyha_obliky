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

export default function ExportButtons({ rows, disabled }) {

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

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Button variant="contained" onClick={handleExcel} disabled={disabled}>
          Експорт у Excel
        </Button>
      </Stack>
    </Card>
  );
}
