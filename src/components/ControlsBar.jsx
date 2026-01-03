import {
  Box,
  Card,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';

export default function ControlsBar({
  groupByDay,
  onGroupByDayChange,
  showSummaries,
  onShowSummariesChange,
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange
}) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Box flex={1}>
            <TextField
              fullWidth
              label="Пошук"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="З дати"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.from}
              onChange={(event) =>
                onDateRangeChange({ ...dateRange, from: event.target.value })
              }
            />
            <TextField
              label="По дату"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.to}
              onChange={(event) =>
                onDateRangeChange({ ...dateRange, to: event.target.value })
              }
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography fontWeight={600}>Групування</Typography>
            <ToggleButtonGroup
              value={groupByDay ? 'grouped' : 'single'}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  onGroupByDayChange(value === 'grouped');
                }
              }}
            >
              <ToggleButton value="grouped">За день</ToggleButton>
              <ToggleButton value="single">Окремо</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography fontWeight={600}>Підсумки</Typography>
            <ToggleButtonGroup
              value={showSummaries ? 'show' : 'hide'}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  onShowSummariesChange(value === 'show');
                }
              }}
            >
              <ToggleButton value="show">Показати</ToggleButton>
              <ToggleButton value="hide">Приховати</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
