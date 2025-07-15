// React
import { useCallback, useState } from 'react';

// Componets
import UploadItem from '../molecules/upload-item';
import Dropzone from '../molecules/dropzone';
import FullCenter from '../atoms/center';
import Panel from '../atoms/panel';

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
            url={`${process.env.REACT_APP_ULTRON_API_URL}/files/upload`}
            onRemove={onRemove}
          />
        ))}
      </Panel>
    </FullCenter>
  );
};

export default Uploader;
