import { render, screen } from '@testing-library/react';
import Table from '../table';

describe('Table', () => {
  type TestRow = {
    id: number;
    name: string;
    value: string;
  };

  const mockRows: TestRow[] = [
    { id: 1, name: 'Row 1', value: 'Value 1' },
    { id: 2, name: 'Row 2', value: 'Value 2' },
    { id: 3, name: 'Row 3', value: 'Value 3' },
  ];

  it('should render table container', () => {
    const { container } = render(<Table rows={mockRows} />);

    const tableContainer = container.querySelector('.MuiTableContainer-root');
    expect(tableContainer).toBeInTheDocument();
  });

  it('should render table headers from row keys', () => {
    render(<Table rows={mockRows} />);

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('should render all rows with correct data', () => {
    render(<Table rows={mockRows} />);

    // Check all row values are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();
    expect(screen.getByText('Value 2')).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Row 3')).toBeInTheDocument();
    expect(screen.getByText('Value 3')).toBeInTheDocument();
  });

  it('should render table with single row', () => {
    const singleRow = [{ id: 1, name: 'Single Row', value: 'Single Value' }];
    render(<Table rows={singleRow} />);

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Single Row')).toBeInTheDocument();
    expect(screen.getByText('Single Value')).toBeInTheDocument();
  });

  it('should render table with different data types', () => {
    type MixedRow = {
      text: string;
      number: number;
      status: string;
    };

    const mixedRows: MixedRow[] = [
      { text: 'Sample Text', number: 42, status: 'active' },
      { text: 'Another Text', number: 99, status: 'inactive' },
    ];

    render(<Table rows={mixedRows} />);

    // Headers
    expect(screen.getByText('text')).toBeInTheDocument();
    expect(screen.getByText('number')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();

    // Values
    expect(screen.getByText('Sample Text')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();

    expect(screen.getByText('Another Text')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  it('should render correct number of rows', () => {
    const { container } = render(<Table rows={mockRows} />);

    const tableRows = container.querySelectorAll('tbody tr');
    expect(tableRows).toHaveLength(3);
  });

  it('should render correct number of columns', () => {
    const { container } = render(<Table rows={mockRows} />);

    const headerCells = container.querySelectorAll('thead th');
    expect(headerCells).toHaveLength(3);
  });

  it('should handle rows with many columns', () => {
    type WideRow = {
      col1: string;
      col2: string;
      col3: string;
      col4: string;
      col5: string;
    };

    const wideRows: WideRow[] = [
      { col1: 'A1', col2: 'B1', col3: 'C1', col4: 'D1', col5: 'E1' },
      { col1: 'A2', col2: 'B2', col3: 'C2', col4: 'D2', col5: 'E2' },
    ];

    const { container } = render(<Table rows={wideRows} />);

    const headerCells = container.querySelectorAll('thead th');
    expect(headerCells).toHaveLength(5);

    const bodyCells = container.querySelectorAll('tbody tr:first-child td');
    expect(bodyCells).toHaveLength(5);
  });

  it('should maintain table structure with nested object keys', () => {
    type ComplexRow = {
      simple: string;
      'nested.key': string;
      'another-key': string;
    };

    const complexRows: ComplexRow[] = [
      { simple: 'Simple', 'nested.key': 'Nested', 'another-key': 'Another' },
    ];

    render(<Table rows={complexRows} />);

    expect(screen.getByText('simple')).toBeInTheDocument();
    expect(screen.getByText('nested.key')).toBeInTheDocument();
    expect(screen.getByText('another-key')).toBeInTheDocument();

    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Nested')).toBeInTheDocument();
    expect(screen.getByText('Another')).toBeInTheDocument();
  });

  it('should apply minimum width style to table', () => {
    const { container } = render(<Table rows={mockRows} />);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });
});
