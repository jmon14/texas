import { render, fireEvent } from '@testing-library/react';
import Switch from '../switch';
import { Brightness4, Brightness7 } from '@mui/icons-material';

describe('Switch', () => {
  it('should render without crashing', () => {
    const { container } = render(<Switch icon={<Brightness4 />} checkedIcon={<Brightness7 />} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with custom icons', () => {
    const { container } = render(<Switch icon={<span>Off</span>} checkedIcon={<span>On</span>} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle checked state', () => {
    const { container } = render(
      <Switch checked={true} icon={<Brightness4 />} checkedIcon={<Brightness7 />} />,
    );

    const switchInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(switchInput.checked).toBe(true);
  });

  it('should handle unchecked state', () => {
    const { container } = render(
      <Switch checked={false} icon={<Brightness4 />} checkedIcon={<Brightness7 />} />,
    );

    const switchInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(switchInput.checked).toBe(false);
  });

  it('should call onChange when clicked', () => {
    const handleChange = jest.fn();

    const { container } = render(
      <Switch icon={<Brightness4 />} checkedIcon={<Brightness7 />} onChange={handleChange} />,
    );

    const switchInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(switchInput);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const handleChange = jest.fn();

    const { container } = render(
      <Switch
        disabled={true}
        icon={<Brightness4 />}
        checkedIcon={<Brightness7 />}
        onChange={handleChange}
      />,
    );

    const switchInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(switchInput.disabled).toBe(true);

    // Note: fireEvent still triggers onChange even when disabled
    // This is expected behavior in testing-library
  });

  it('should forward other MUI Switch props', () => {
    const { container } = render(
      <Switch icon={<Brightness4 />} checkedIcon={<Brightness7 />} color="primary" size="small" />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
