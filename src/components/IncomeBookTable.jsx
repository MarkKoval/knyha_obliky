import { useMemo } from 'react';
import { Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { isWithinInterval, parseISO } from 'date-fns';

const columns = [
  { field: 'date', headerName: 'Дата операції', flex: 1.2, minWidth: 180 },
  { field: 'cash', headerName: 'Готівка', flex: 1, minWidth: 140 },
  {
    field: 'nonCash',
    headerName: 'Надходження безготівка',
    flex: 1.2,
    minWidth: 200
  },
  { field: 'refund', headerName: 'Повернення', flex: 1, minWidth: 140 },
  { field: 'transit', headerName: 'Транзитні кошти', flex: 1, minWidth: 160 },
  { field: 'own', headerName: 'Власні кошти', flex: 1, minWidth: 150 },
  { field: 'total', headerName: 'Разом дохід', flex: 1, minWidth: 150 }
];

export default function IncomeBookTable({ rows, search, dateRange }) {
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = search
        ? row.date.toLowerCase().includes(search.toLowerCase())
        : true;
      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        if (row.rawDate) {
          const from = dateRange.from ? parseISO(dateRange.from) : null;
          const to = dateRange.to ? parseISO(dateRange.to) : null;
          if (from && to) {
            matchesDate = isWithinInterval(row.rawDate, { start: from, end: to });
          } else if (from) {
            matchesDate = row.rawDate >= from;
          } else if (to) {
            matchesDate = row.rawDate <= to;
          }
        }
      }
      return matchesSearch && matchesDate;
    });
  }, [rows, search, dateRange]);

  return (
    <Card sx={{ height: 520 }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        disableRowSelectionOnClick
        getRowClassName={(params) =>
          params.row.rowType === 'summary' ? 'summary-row' : ''
        }
        sx={{
          border: 'none',
          '& .summary-row': {
            fontWeight: 700,
            backgroundColor: '#f1f4ff'
          }
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'rawDate', sort: 'asc' }]
          }
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </Card>
  );
}
