// External libraries
import { memo } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import { alpha, Box, BoxProps, Link, styled, Typography } from '@mui/material';

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  config?: {
    multiple?: boolean;
    accept?: Accept;
    maxSize?: number;
  };
};

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
