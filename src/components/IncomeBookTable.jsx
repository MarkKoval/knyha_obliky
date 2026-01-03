import { useMemo } from 'react';
import { Button, Card } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
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

export default function IncomeBookTable({ rows, search, dateRange, onRowUpdate, onAddRow }) {
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const dateText = row?.date ? row.date.toString() : '';
      const matchesSearch = search
        ? dateText.toLowerCase().includes(search.toLowerCase())
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
        isCellEditable={(params) => {
          if (params.row.rowType === 'summary') {
            return false;
          }
          if (typeof params.id === 'string' && params.id.includes('-summary')) {
            return false;
          }
          return true;
        }}
        processRowUpdate={onRowUpdate}
        getRowClassName={(params) =>
          params.row.rowType === 'summary' ? 'summary-row' : ''
        }
        slots={{
          toolbar: () => (
            <GridToolbarContainer sx={{ px: 2, py: 1 }}>
              <Button size="small" variant="outlined" onClick={onAddRow}>
                Додати рядок
              </Button>
            </GridToolbarContainer>
          )
        }}
        sx={{
          border: 'none',
          '& .summary-row': {
            fontWeight: 700,
            backgroundColor: '#f1f4ff'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f7f8fd',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(148, 163, 184, 0.15)'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f4f7ff'
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#ffffff'
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
