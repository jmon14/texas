import { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';

import UploadItemComp from '../upload-item';

const meta: Meta<typeof UploadItemComp> = {
  title: 'Molecules/UploadItem',
  component: UploadItemComp,
  argTypes: {
    file: {
      description: 'File to be uploaded',
    },
    url: {
      description: 'URL to upload the file',
    },
  },
};

export default meta;

type Story = StoryObj<typeof UploadItemComp>;

// TODO - Investigate how to integrate onUploadProgress

export const MockedSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('https://test-endpoint/', () => {
          return HttpResponse.json();
        }),
      ],
    },
  },
  args: {
    file: new File(['file content'], 'file.txt'),
    url: 'https://test-endpoint/',
  },
};

export const MockedFailure: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('https://test-endpoint-v2/', () => {
          return HttpResponse.json(null, {
            status: 403,
          });
        }),
      ],
    },
  },
  args: {
    file: new File(['file content'], 'file.txt'),
    url: 'https://test-endpoint-v2/',
  },
};
