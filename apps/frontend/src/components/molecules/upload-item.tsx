// React
import { useEffect } from 'react';

// External libraries
import { Close, UploadFile } from '@mui/icons-material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// Hooks
import { useUploadForm } from '../../hooks/useUploadForm';
import { FetchStatus } from '../../constants';

type UploadItemProps = {
  url: string;
  file: File;
  onRemove: (file: File) => void;
};

const UploadItem = ({ url, file, onRemove }: UploadItemProps) => {
  const { uploadForm, state, progress } = useUploadForm(url);
  const stateLabel = state[0].toUpperCase() + state.slice(1);
  const color = state === FetchStatus.FAILED ? 'error' : 'primary';
  const buttonDisabled = state === FetchStatus.LOADING || state === FetchStatus.IDDLE;

  useEffect(() => {
    const formData = new FormData();
    formData.append('file', file);
    uploadForm(formData);
  }, [file, uploadForm]);

  return (
    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center', p: '8px' }}>
      <UploadFile color={color} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">{file.name}</Typography>
        <Typography color={(theme) => theme.palette.text.secondary} variant="body2">
          {`${file.size} Bytes • ${stateLabel}`}
        </Typography>
        <LinearProgress value={progress} variant="determinate" color={color} sx={{ mt: '4px' }} />
      </Box>
      <IconButton disabled={buttonDisabled} onClick={() => onRemove(file)}>
        <Close />
      </IconButton>
    </Box>
  );
};

export default UploadItem;
