import { render, screen } from '@testing-library/react';
import UploadItem from '../upload-item';

// Mock the useUploadForm hook
jest.mock('../../../hooks/useUploadForm', () => ({
  useUploadForm: () => ({
    uploadForm: jest.fn(),
    state: 'loading',
    progress: 50,
  }),
}));

describe('UploadItem', () => {
  const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });
  const mockUrl = 'http://example.com/upload';
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display file name', () => {
    render(<UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />);

    expect(screen.getByText('test.csv')).toBeInTheDocument();
  });

  it('should display file size', () => {
    render(<UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />);

    expect(screen.getByText(/Bytes/)).toBeInTheDocument();
  });

  it('should display upload state', () => {
    render(<UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />);

    // State is mocked as 'loading', which becomes 'Loading' after capitalization
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('should display upload icon', () => {
    const { container } = render(
      <UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />,
    );

    const uploadIcon = container.querySelector('svg');
    expect(uploadIcon).toBeInTheDocument();
  });

  it('should display progress bar', () => {
    const { container } = render(
      <UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />,
    );

    const progressBar = container.querySelector('.MuiLinearProgress-root');
    expect(progressBar).toBeInTheDocument();
  });

  it('should display remove button', () => {
    render(<UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeInTheDocument();
  });

  it('should have remove button disabled during upload', () => {
    render(<UploadItem url={mockUrl} file={mockFile} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeDisabled();
  });

  it('should accept file prop', () => {
    const customFile = new File(['data'], 'custom.csv', { type: 'text/csv' });

    render(<UploadItem url={mockUrl} file={customFile} onRemove={mockOnRemove} />);

    expect(screen.getByText('custom.csv')).toBeInTheDocument();
  });

  it('should accept url prop', () => {
    const customUrl = 'http://custom-url.com/upload';

    const { container } = render(
      <UploadItem url={customUrl} file={mockFile} onRemove={mockOnRemove} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with different file sizes', () => {
    const largeFile = new File([new ArrayBuffer(1024 * 1024)], 'large.csv', {
      type: 'text/csv',
    });

    render(<UploadItem url={mockUrl} file={largeFile} onRemove={mockOnRemove} />);

    expect(screen.getByText('large.csv')).toBeInTheDocument();
  });
});
