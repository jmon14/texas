import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import Uploader from '../uploader';

// Mock the UploadItem component since it makes API calls
jest.mock('../../molecules/upload-item', () => {
  return function MockUploadItem({
    file,
    onRemove,
  }: {
    file: File;
    onRemove: (file: File) => void;
  }) {
    return (
      <div data-testid={`upload-item-${file.name}`}>
        <span>{file.name}</span>
        <button onClick={() => onRemove(file)}>Remove</button>
      </div>
    );
  };
});

describe('Uploader', () => {
  it('should render dropzone', () => {
    render(<Uploader />);

    // Dropzone text should be present
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  it('should accept CSV and PDF files', () => {
    render(<Uploader />);

    // Check if accepted file types are displayed
    expect(screen.getByText(/Accepted files:.*\.csv, \.pdf/i)).toBeInTheDocument();
  });

  it('should add file to list when dropped', async () => {
    render(<Uploader />);

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

    // Get the file input (hidden in dropzone)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const userEvent = user.setup();
    if (input) {
      await userEvent.upload(input, file);
    }

    await waitFor(() => {
      expect(screen.getByTestId('upload-item-test.csv')).toBeInTheDocument();
    });
  });

  it('should not add duplicate files', async () => {
    render(<Uploader />);

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const userEvent = user.setup();
    if (input) {
      // Upload same file twice
      await userEvent.upload(input, file);
      await userEvent.upload(input, file);
    }

    await waitFor(() => {
      const items = screen.getAllByTestId('upload-item-test.csv');
      // Should only have one item
      expect(items.length).toBe(1);
    });
  });

  it('should add multiple different files', async () => {
    render(<Uploader />);

    const file1 = new File(['content 1'], 'file1.csv', { type: 'text/csv' });
    const file2 = new File(['content 2'], 'file2.pdf', { type: 'application/pdf' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const userEvent = user.setup();
    if (input) {
      await userEvent.upload(input, file1);
      await userEvent.upload(input, file2);
    }

    await waitFor(() => {
      expect(screen.getByTestId('upload-item-file1.csv')).toBeInTheDocument();
      expect(screen.getByTestId('upload-item-file2.pdf')).toBeInTheDocument();
    });
  });

  it('should remove file when remove button is clicked', async () => {
    render(<Uploader />);

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const userEvent = user.setup();
    if (input) {
      await userEvent.upload(input, file);
    }

    await waitFor(() => {
      expect(screen.getByTestId('upload-item-test.csv')).toBeInTheDocument();
    });

    // Click remove button
    const removeButton = screen.getByText('Remove');
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('upload-item-test.csv')).not.toBeInTheDocument();
    });
  });

  it('should display file names', async () => {
    render(<Uploader />);

    const file = new File(['test content'], 'my-file.csv', { type: 'text/csv' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const userEvent = user.setup();
    if (input) {
      await userEvent.upload(input, file);
    }

    await waitFor(() => {
      expect(screen.getByText('my-file.csv')).toBeInTheDocument();
    });
  });

  it('should handle empty file list', () => {
    const { container } = render(<Uploader />);

    // Should render without errors
    expect(container.firstChild).toBeInTheDocument();

    // Should only show dropzone, no upload items
    expect(screen.queryByTestId(/upload-item-/)).not.toBeInTheDocument();
  });

  it('should allow uploading after removing a file', async () => {
    render(<Uploader />);

    const file1 = new File(['content 1'], 'file1.csv', { type: 'text/csv' });
    const file2 = new File(['content 2'], 'file2.csv', { type: 'text/csv' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const userEvent = user.setup();
    if (input) {
      // Upload first file
      await userEvent.upload(input, file1);

      await waitFor(() => {
        expect(screen.getByTestId('upload-item-file1.csv')).toBeInTheDocument();
      });

      // Remove first file
      const removeButton = screen.getByText('Remove');
      await userEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('upload-item-file1.csv')).not.toBeInTheDocument();
      });

      // Upload second file
      await userEvent.upload(input, file2);

      await waitFor(() => {
        expect(screen.getByTestId('upload-item-file2.csv')).toBeInTheDocument();
      });
    }
  });
});
