import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import FileDropzone from './components/FileDropzone.jsx';
import ColumnMapper from './components/ColumnMapper.jsx';
import IncomeBookTable from './components/IncomeBookTable.jsx';
import ControlsBar from './components/ControlsBar.jsx';
import ExportButtons from './components/ExportButtons.jsx';
import parseBankStatement from './domain/parseBankStatement.js';
import buildIncomeBook from './domain/buildIncomeBook.js';
import buildSummaries from './domain/buildSummaries.js';
import { loadLastDocument, saveLastDocument, clearLastDocument } from './storage/persistence.js';

const steps = ['Завантаження', 'Мапінг колонок', 'Результат'];

export default function App() {
  const [rawRows, setRawRows] = useState([]);
  const [rawColumns, setRawColumns] = useState([]);
  const [mapping, setMapping] = useState({
    date: '',
    amount: '',
    description: ''
  });
  const [groupByDay, setGroupByDay] = useState(true);
  const [showSummaries, setShowSummaries] = useState(true);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const saved = loadLastDocument();
    if (saved) {
      setRawRows(saved.rawRows);
      setRawColumns(saved.rawColumns);
      setMapping(saved.mapping);
      setGroupByDay(saved.groupByDay ?? true);
      setShowSummaries(saved.showSummaries ?? true);
    }
  }, []);

  useEffect(() => {
    if (!rawRows.length) {
      return;
    }
    saveLastDocument({
      rawRows,
      rawColumns,
      mapping,
      groupByDay,
      showSummaries
    });
  }, [rawRows, rawColumns, mapping, groupByDay, showSummaries]);

  const stepIndex = rawRows.length === 0 ? 0 : mapping.date && mapping.amount ? 2 : 1;

  const incomeRows = useMemo(() => {
    if (!rawRows.length || !mapping.date || !mapping.amount) {
      return [];
    }
    return buildIncomeBook(rawRows, mapping, { groupByDay });
  }, [rawRows, mapping, groupByDay]);

  const displayRows = useMemo(() => {
    if (!incomeRows.length) {
      return [];
    }
    const rowsWithSummaries = showSummaries ? buildSummaries(incomeRows) : incomeRows;
    return rowsWithSummaries;
  }, [incomeRows, showSummaries]);

  const documentYear = useMemo(() => {
    if (!incomeRows.length) {
      return currentYear;
    }
    const firstDate = incomeRows.reduce((min, row) => {
      if (!(row.rawDate instanceof Date)) {
        return min;
      }
      if (!min) {
        return row.rawDate;
      }
      return row.rawDate < min ? row.rawDate : min;
    }, null);
    return firstDate ? firstDate.getFullYear() : currentYear;
  }, [incomeRows, currentYear]);

  const handleFile = async (file) => {
    try {
      setError('');
      const { rows, columns } = await parseBankStatement(file);
      setRawRows(rows);
      setRawColumns(columns);
      setMapping({ date: '', amount: '', description: '' });
    } catch (err) {
      setError(err.message || 'Не вдалося прочитати файл');
    }
  };

  const handleReset = () => {
    setRawRows([]);
    setRawColumns([]);
    setMapping({ date: '', amount: '', description: '' });
    setGroupByDay(true);
    setShowSummaries(true);
    setSearch('');
    setDateRange({ from: '', to: '' });
    clearLastDocument();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Книга обліку доходів
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            КНИГА ОБЛІКУ ДОХОДІВ для платників єдиного податку 1,2,3 груп, які не є платниками ПДВ
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
            <Typography color="text.secondary">на {documentYear} рік</Typography>
            <Typography color="text.secondary">одиниці виміру: грн</Typography>
          </Stack>
          <Typography color="text.secondary">
            Завантажте банківську виписку, налаштуйте колонки та отримайте готову книгу.
          </Typography>
        </Box>

        <Stepper activeStep={stepIndex} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {stepIndex === 0 && (
          <FileDropzone onFile={handleFile} error={error} />
        )}

        {stepIndex >= 1 && (
          <ColumnMapper
            rows={rawRows}
            columns={rawColumns}
            mapping={mapping}
            onMappingChange={setMapping}
          />
        )}

        {stepIndex === 2 && (
          <>
            <ControlsBar
              groupByDay={groupByDay}
              onGroupByDayChange={setGroupByDay}
              showSummaries={showSummaries}
              onShowSummariesChange={setShowSummaries}
              search={search}
              onSearchChange={setSearch}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onReset={handleReset}
            />
            <Divider />
            <IncomeBookTable
              rows={displayRows}
              search={search}
              dateRange={dateRange}
            />
            <ExportButtons
              rows={displayRows}
              disabled={!displayRows.length}
              year={documentYear}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
