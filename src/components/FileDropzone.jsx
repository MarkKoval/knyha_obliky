import { useRef, useState } from 'react';
import { Box, Button, Card, Stack, Typography, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileDropzone({ onFile, error }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFile(file);
    }
  };

  return (
    <Card
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed #d0d6f4',
        backgroundColor: dragActive ? '#eef4ff' : 'background.paper'
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: '#f2f4ff'
          }}
        >
          <UploadFileIcon color="primary" fontSize="large" />
        </Box>
        <Typography variant="h6" fontWeight={600}>
          Перетягніть файл сюди або натисніть кнопку
        </Typography>
        <Typography color="text.secondary">
          Підтримуються файли .xls та .xlsx
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => inputRef.current?.click()}
        >
          Завантажити .xls
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".xls,.xlsx"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFile(file);
            }
          }}
        />
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Card>
  );
}
