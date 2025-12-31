// React
import { useCallback, useState } from 'react';

// Componets
import UploadItem from '../molecules/upload-item';
import Dropzone from '../molecules/dropzone';
import FullCenter from '../atoms/center';
import Panel from '../atoms/panel';

/**
 * Uploader component - File upload interface with drag-and-drop and progress tracking.
 *
 * Provides a complete file upload workflow with dropzone for file selection,
 * automatic duplicate detection, and progress indicators for each file. Accepts
 * CSV and PDF files. Shows upload progress with remove buttons for each file.
 * Files are uploaded to the backend API endpoint automatically after selection.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in route
 * <Route path="/upload" element={<Uploader />} />
 * ```
 *
 * @example
 * In a page with layout
 * ```tsx
 * <DashboardLayout>
 *   <Typography variant="h4">Upload Files</Typography>
 *   <Uploader />
 * </DashboardLayout>
 * ```
 *
 * @returns {JSX.Element} Rendered uploader with dropzone and file list
 *
 * @remarks
 * Features:
 * - Drag-and-drop file selection
 * - Click to browse file picker
 * - Accepts CSV and PDF files
 * - Automatic duplicate file detection (by name)
 * - Shows upload progress for each file
 * - Remove button for each file
 * - Centered layout with panel wrapper
 * - Uploads to REACT_APP_BACKEND_API_URL/files/upload
 *
 * File handling:
 * - Prevents duplicate files by name
 * - Maintains file list state
 * - Removes files from list when user clicks remove
 * - Each file uploads independently
 */
const Uploader = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((_files) => {
      const slice = _files.slice();
      for (const acceptedFile of acceptedFiles) {
        if (!_files.find((file) => file.name === acceptedFile.name)) {
          slice.push(acceptedFile);
        }
      }
      return slice;
    });
  }, []);

  const onRemove = (file: File) => {
    setFiles((_files) => {
      return _files.filter((_file) => file.name !== _file.name);
    });
  };

  return (
    <FullCenter>
      <Panel sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Dropzone onDrop={onDrop} config={{ accept: { 'text/csv': ['.csv', '.pdf'] } }} />
        {files.map((file) => (
          <UploadItem
            key={file.name}
            file={file}
            url={`${process.env.REACT_APP_BACKEND_API_URL}/files/upload`}
            onRemove={onRemove}
          />
        ))}
      </Panel>
    </FullCenter>
  );
};

export default Uploader;
