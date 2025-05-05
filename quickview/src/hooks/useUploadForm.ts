import { useCallback, useState } from 'react';
import { defaultInstance } from '../api/api';
import { FetchStatus } from '../constants';

export const useUploadForm = (url: string) => {
  const [state, setState] = useState<FetchStatus>(FetchStatus.IDDLE);
  const [progress, setProgress] = useState(0);

  const uploadForm = useCallback(
    async (formData: FormData) => {
      try {
        await defaultInstance.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setProgress(progress);
            setState(FetchStatus.LOADING);
          },
        });
        setState(FetchStatus.SUCCEDED);
      } catch (err) {
        setState(FetchStatus.FAILED);
      }
    },
    [url],
  );

  return { uploadForm, state, progress };
};
