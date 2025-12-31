import {
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const previewRowsLimit = 8;

function buildPreviewRows(rows) {
  return rows.slice(0, previewRowsLimit).map((row, index) => ({
    id: index + 1,
    ...row
  }));
}

export default function ColumnMapper({ rows, columns, mapping, onMappingChange }) {
  const previewColumns = columns.map((column) => ({
    field: column,
    headerName: column,
    flex: 1,
    minWidth: 140
  }));

  const options = columns.map((column) => (
    <MenuItem key={column} value={column}>
      {column}
    </MenuItem>
  ));

  const autoDetect = () => {
    const next = { date: '', amount: '', description: '' };
    columns.forEach((column) => {
      const lower = column.toLowerCase();
      if (!next.date && /date|дата/.test(lower)) {
        next.date = column;
      }
      if (!next.amount && /amount|sum|сума|надход/.test(lower)) {
        next.amount = column;
      }
      if (!next.description && /type|опис|detail|comment|признач/.test(lower)) {
        next.description = column;
      }
    });
    onMappingChange({
      date: next.date || mapping.date,
      amount: next.amount || mapping.amount,
      description: next.description || mapping.description
    });
  };

  return (
    <Stack spacing={2}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            Мапінг колонок
          </Typography>
          <Typography color="text.secondary">
            Оберіть, які колонки відповідають даті, сумі надходження та опису операції.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Дата операції</InputLabel>
                <Select
                  label="Дата операції"
                  value={mapping.date}
                  onChange={(event) =>
                    onMappingChange({ ...mapping, date: event.target.value })
                  }
                >
                  {options}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Сума надходження</InputLabel>
                <Select
                  label="Сума надходження"
                  value={mapping.amount}
                  onChange={(event) =>
                    onMappingChange({ ...mapping, amount: event.target.value })
                  }
                >
                  {options}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Опис / тип (опц.)</InputLabel>
                <Select
                  label="Опис / тип (опц.)"
                  value={mapping.description}
                  onChange={(event) =>
                    onMappingChange({ ...mapping, description: event.target.value })
                  }
                >
                  <MenuItem value="">Не використовується</MenuItem>
                  {options}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box>
            <Typography
              onClick={autoDetect}
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            >
              Автовизначення
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Card sx={{ height: 360 }}>
        <DataGrid
          rows={buildPreviewRows(rows)}
          columns={previewColumns}
          disableRowSelectionOnClick
          hideFooter
          sx={{ border: 'none' }}
        />
      </Card>
    </Stack>
  );
}
