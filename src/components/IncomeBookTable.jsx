import { useMemo, useState, useCallback } from 'react';
import { Card, Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowModes,
} from '@mui/x-data-grid';
import { isWithinInterval, parseISO } from 'date-fns';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

const baseColumns = [
  { field: 'date', headerName: 'Дата операції', flex: 1.2, minWidth: 180, editable: true },
  { field: 'cash', headerName: 'Готівка', flex: 1, minWidth: 120, editable: true, type: 'number' },
  { field: 'nonCash', headerName: 'Надходження безготівка', flex: 1.2, minWidth: 120, editable: true, type: 'number' },
  { field: 'refund', headerName: 'Повернення', flex: 1, minWidth: 100, editable: true, type: 'number' },
  { field: 'transit', headerName: 'Транзитні кошти', flex: 1, minWidth: 120, editable: true, type: 'number' },
  { field: 'own', headerName: 'Власні кошти', flex: 1, minWidth: 100, editable: true, type: 'number' },
  { field: 'total', headerName: 'Разом дохід', flex: 1, minWidth: 120, editable: false, type: 'number' },
];


export default function IncomeBookTable({ rows, search, dateRange, onRowUpdate, onAddRow }) {
  const [rowModesModel, setRowModesModel] = useState({});

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

  // 🔥 Excel-style actions column
  const columns = useMemo(() => {
    return [
      ...baseColumns,
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Дії',
        minWidth: 120,
        getActions: (params) => {
          const id = params.id;
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          // summary rows — без кнопок
          if (params.row.rowType === 'summary' || (typeof id === 'string' && id.includes('-summary'))) {
            return [];
          }

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                onClick={() => handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancel"
                onClick={() => handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];
  }, [rowModesModel]);

  const handleRowEditStart = (params, event) => {
    // щоб редагування не стартувало по double click
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = useCallback((id) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  }, []);

  const handleSaveClick = useCallback((id) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  }, []);

  const handleCancelClick = useCallback((id) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  }, []);

  const handleRowModesModelChange = (newModel) => {
    setRowModesModel(newModel);
  };

  // 🔥 тут зберігаємо рядок в state + onRowUpdate
  const processRowUpdate = async (newRow, oldRow) => {
    if (newRow.rowType === 'summary') return oldRow;

    // перерахунок total
    const cash = Number(newRow.cash || 0);
    const nonCash = Number(newRow.nonCash || 0);
    const refund = Number(newRow.refund || 0);
    const transit = Number(newRow.transit || 0);
    const own = Number(newRow.own || 0);

    const updatedRow = {
      ...newRow,
      total: cash + nonCash + transit + own - refund,
    };

    // викликаємо твою функцію (має оновити rows у батьківському state)
    const savedRow = await onRowUpdate(updatedRow, oldRow);

    return savedRow ?? updatedRow;
  };

  return (
    <Card sx={{ height: 520 }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}

        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}

        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}

        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error('Row update error:', error);
        }}

        disableRowSelectionOnClick
        getRowClassName={(params) =>
          params.row.rowType === 'summary' ? 'summary-row' : ''
        }



        sx={{
          border: 'none',
          '& .summary-row': {
            fontWeight: 700,
            backgroundColor: '#f1f4ff',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f7f8fd',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f4f7ff',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#ffffff',
          },
        }}

        initialState={{
          sorting: {
            sortModel: [{ field: 'rawDate', sort: 'asc' }],
          },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </Card>
  );
}
