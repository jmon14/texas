import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import FormSelect, { SelectOption } from '../form-select';

// Test wrapper component with form context
const TestWrapper = ({
  selectOptions,
  initialValue,
  label = 'Test Select',
  validation,
}: {
  selectOptions: SelectOption[];
  initialValue?: string;
  label?: string;
  validation?: any;
}) => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      testSelect: initialValue || '',
    },
  });

  return (
    <FormSelect
      name="testSelect"
      label={label}
      selectOptions={selectOptions}
      register={register}
      errors={errors}
      getValues={getValues}
      initialValue={initialValue}
      validation={validation}
    />
  );
};

describe('FormSelect', () => {
  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render select component', () => {
    const { container } = render(<TestWrapper selectOptions={mockOptions} label="Choose Option" />);

    // Should render the FormControl
    expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<TestWrapper selectOptions={mockOptions} label="Test Label" />);

    // Label should be in the document (may appear multiple times due to MUI internals)
    expect(screen.getAllByText('Test Label')[0]).toBeInTheDocument();
  });

  it('should display initial value', () => {
    render(<TestWrapper selectOptions={mockOptions} initialValue="option2" />);

    // Check that Option 2 is displayed as the selected value
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should render with empty initial value', () => {
    const { container } = render(<TestWrapper selectOptions={mockOptions} />);

    // Should render without errors
    expect(container.querySelector('.MuiSelect-select')).toBeInTheDocument();
  });

  it('should handle empty options array', () => {
    const { container } = render(<TestWrapper selectOptions={[]} />);

    // Should render without errors
    expect(container.querySelector('.MuiSelect-select')).toBeInTheDocument();
  });

  it('should render with single option', () => {
    const singleOption: SelectOption[] = [{ value: 'only', label: 'Only Option' }];

    render(<TestWrapper selectOptions={singleOption} initialValue="only" />);

    // Selected value should be displayed
    expect(screen.getByText('Only Option')).toBeInTheDocument();
  });

  it('should render FormControl wrapper', () => {
    const { container } = render(
      <TestWrapper selectOptions={mockOptions} label="Wrapped Select" />,
    );

    // FormControl should be present
    const formControl = container.querySelector('.MuiFormControl-root');
    expect(formControl).toBeInTheDocument();
    expect(formControl).toHaveClass('MuiFormControl-fullWidth');
  });

  it('should support disabled state', () => {
    const TestDisabledWrapper = () => {
      const {
        register,
        formState: { errors },
        getValues,
      } = useForm({
        defaultValues: { testSelect: '' },
      });

      return (
        <FormSelect
          name="testSelect"
          label="Disabled Select"
          selectOptions={mockOptions}
          register={register}
          errors={errors}
          getValues={getValues}
          disabled
        />
      );
    };

    const { container } = render(<TestDisabledWrapper />);

    // Select should have disabled class
    const select = container.querySelector('.MuiSelect-select');
    expect(select).toHaveClass('Mui-disabled');
  });

  it('should handle multiple options with different values', () => {
    const multipleOptions: SelectOption[] = [
      { value: 'val1', label: 'Label 1' },
      { value: 'val2', label: 'Label 2' },
      { value: 'val3', label: 'Label 3' },
    ];

    render(<TestWrapper selectOptions={multipleOptions} initialValue="val2" />);

    // Selected label should be displayed
    expect(screen.getByText('Label 2')).toBeInTheDocument();
  });
});
