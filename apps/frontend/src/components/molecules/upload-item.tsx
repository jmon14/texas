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

/**
 * Props for the UploadItem component
 * @interface UploadItemProps
 */
type UploadItemProps = {
  /** API endpoint URL for file upload */
  url: string;
  /** File object to upload */
  file: File;
  /** Callback when remove button is clicked */
  onRemove: (file: File) => void;
};

/**
 * UploadItem component for displaying file upload progress and status.
 *
 * Automatically initiates file upload on mount using the provided URL. Displays
 * file information including name, size, upload progress bar, and current status.
 * Shows remove button (disabled during upload). Color-codes status - primary for
 * normal states, error for failed uploads.
 *
 * @component
 * @example
 * ```tsx
 * Basic file upload
 * <UploadItem
 *   url="/api/files/upload"
 *   file={selectedFile}
 *   onRemove={(file) => console.log('Remove', file.name)}
 * />
 * ```
 *
 * @example
 * Multiple file uploads
 * ```tsx
 * {files.map((file) => (
 *   <UploadItem
 *     key={file.name}
 *     url="/api/upload"
 *     file={file}
 *     onRemove={handleRemoveFile}
 *   />
 * ))}
 * ```
 *
 * @example
 * With custom endpoint
 * ```tsx
 * <UploadItem
 *   url={`/api/users/${userId}/avatar`}
 *   file={avatarFile}
 *   onRemove={handleRemove}
 * />
 * ```
 *
 * @param {UploadItemProps} props - The component props
 * @param {string} props.url - Upload endpoint URL
 * @param {File} props.file - File to upload
 * @param {Function} props.onRemove - Remove handler
 * @returns {JSX.Element} Rendered upload item with progress indicator
 */
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
