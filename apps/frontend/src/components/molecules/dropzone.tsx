// External libraries
import { memo } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

/**
 * Props for the Dropzone component
 * @interface Props
 */
type Props = {
  /** Callback function invoked when files are dropped or selected */
  onDrop: (acceptedFiles: File[]) => void;
  /** Optional configuration for file upload behavior */
  config?: {
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Accepted file types in react-dropzone format */
    accept?: Accept;
    /** Maximum file size in bytes */
    maxSize?: number;
  };
};

/**
 * Default configuration for the dropzone
 * Single CSV file up to 1024 bytes by default
 */
const defaultConfig: Required<Props['config']> = {
  multiple: false,
  accept: { 'text/csv': ['.csv'] },
  maxSize: 1024,
};

// Styled dropzone component
const MyDropzone = styled(Box, { shouldForwardProp: (prop) => prop !== 'state' })<BoxProps>(
  ({ theme }) => ({
    border: `1px dashed ${theme.palette.action.focus}`,
    color: theme.palette.primary.main,
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 4,
    padding: '24px',
    display: 'flex',
    width: '100%',
    gap: 8,
    '& .MuiTypography-subtitle1': {
      color: theme.palette.text.primary,
    },
    '&:hover': {
      border: '1px solid transparent',
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    },
  }),
);

/**
 * Dropzone component for drag-and-drop or click-to-upload file functionality.
 *
 * Provides a user-friendly interface for file uploads with visual feedback during
 * drag operations. Supports file type validation, size limits, and single/multiple
 * file selection. Wraps react-dropzone with Material-UI styling.
 *
 * @component
 * @example
 * ```tsx
 * Single CSV file upload
 * <Dropzone
 *   onDrop={(files) => handleUpload(files)}
 *   config={{
 *     accept: { 'text/csv': ['.csv'] },
 *     maxSize: 5 * 1024 * 1024, // 5MB
 *     multiple: false
 *   }}
 * />
 * ```
 *
 * @example
 * Multiple image upload
 * ```tsx
 * <Dropzone
 *   onDrop={(files) => uploadImages(files)}
 *   config={{
 *     accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
 *     maxSize: 10 * 1024 * 1024, // 10MB
 *     multiple: true
 *   }}
 * />
 * ```
 *
 * @param {Props} props - The component props
 * @param {Function} props.onDrop - Callback with accepted files
 * @param {Object} [props.config] - Upload configuration
 * @returns {JSX.Element} Rendered dropzone component
 */
const Dropzone = ({ onDrop, config }: Props) => {
  const { accept, multiple, maxSize } = {
    ...defaultConfig,
    ...config,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  const dropzoneSubtitle = (accept: Accept, maxSize: number) => {
    const acceptString = Object.values(accept)[0].join(', ');
    return `Accepted files: ${acceptString} • Max size: ${maxSize} Bytes`;
  };

  return (
    <MyDropzone {...getRootProps({})}>
      <input {...getInputProps()} />
      <UploadFile />
      {isDragActive ? (
        <Typography variant="subtitle1">Drop the files here...</Typography>
      ) : (
        <>
          <Typography variant="subtitle1">
            <Link>Click to upload</Link>
            &nbsp;or drag and drop
          </Typography>
          <Typography color={(theme) => theme.palette.text.secondary} variant="body2">
            {dropzoneSubtitle(accept, maxSize)}
          </Typography>
        </>
      )}
    </MyDropzone>
  );
};

export default memo(Dropzone);
