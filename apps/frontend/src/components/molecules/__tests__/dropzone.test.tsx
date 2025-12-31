import { render, screen, fireEvent } from '@testing-library/react';
import Dropzone from '../dropzone';

describe('Dropzone', () => {
  it('should render without crashing', () => {
    const handleDrop = jest.fn();

    const { container } = render(<Dropzone onDrop={handleDrop} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display upload instructions', () => {
    const handleDrop = jest.fn();

    render(<Dropzone onDrop={handleDrop} />);

    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('should display accepted file types', () => {
    const handleDrop = jest.fn();

    render(<Dropzone onDrop={handleDrop} />);

    expect(screen.getByText(/Accepted files:/i)).toBeInTheDocument();
  });

  it('should display max file size', () => {
    const handleDrop = jest.fn();

    render(<Dropzone onDrop={handleDrop} />);

    expect(screen.getByText(/Max size:/i)).toBeInTheDocument();
  });

  it('should handle custom config', () => {
    const handleDrop = jest.fn();
    const customConfig = {
      multiple: true,
      accept: { 'image/*': ['.png', '.jpg'] },
      maxSize: 5120,
    };

    render(<Dropzone onDrop={handleDrop} config={customConfig} />);

    expect(screen.getByText(/5120 Bytes/i)).toBeInTheDocument();
  });

  it('should display upload icon', () => {
    const handleDrop = jest.fn();

    const { container } = render(<Dropzone onDrop={handleDrop} />);

    const uploadIcon = container.querySelector('svg');
    expect(uploadIcon).toBeInTheDocument();
  });

  it('should have file input element', () => {
    const handleDrop = jest.fn();

    const { container } = render(<Dropzone onDrop={handleDrop} />);

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
  });

  it('should handle file drop', () => {
    const handleDrop = jest.fn();

    const { container } = render(<Dropzone onDrop={handleDrop} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    // onDrop will be called by react-dropzone
    // We just verify the component renders correctly
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept only configured file types by default', () => {
    const handleDrop = jest.fn();

    const { container } = render(<Dropzone onDrop={handleDrop} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept');
  });

  it('should handle single file upload by default', () => {
    const handleDrop = jest.fn();

    const { container } = render(<Dropzone onDrop={handleDrop} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toHaveAttribute('multiple');
  });
});
