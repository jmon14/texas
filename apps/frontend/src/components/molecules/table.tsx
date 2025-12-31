import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableMui from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';

/**
 * Props for the Table component
 * @interface TableProps
 * @template TRow - Type of row objects (must be an object)
 */
type TableProps<TRow extends object> = {
  /** Array of row objects to display in the table */
  rows: TRow[];
};

/**
 * Generic Table component for displaying tabular data with type-safe rows.
 *
 * Automatically generates columns from the first row's object keys and displays
 * all row data in a Material-UI table. Headers are derived from object property names.
 * Assumes all rows have the same structure as the first row.
 *
 * @component
 * @template TRow - Type of row objects
 * @example
 * ```tsx
 * Basic usage with user data
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const users: User[] = [
 *   { id: 1, name: 'John', email: 'john@example.com' },
 *   { id: 2, name: 'Jane', email: 'jane@example.com' }
 * ];
 *
 * <Table rows={users} />
 * ```
 *
 * @example
 * With poker scenario data
 * ```tsx
 * interface ScenarioRow {
 *   name: string;
 *   difficulty: string;
 *   category: string;
 *   position: string;
 * }
 *
 * <Table rows={scenarioData} />
 * ```
 *
 * @example
 * With custom object types
 * ```tsx
 * const gameStats = [
 *   { hand: 'AA', wins: 120, losses: 30, winRate: '80%' },
 *   { hand: 'KK', wins: 100, losses: 40, winRate: '71%' }
 * ];
 *
 * <Table rows={gameStats} />
 * ```
 *
 * @param {TableProps<TRow>} props - The component props
 * @param {TRow[]} props.rows - Array of row data
 * @returns {JSX.Element} Rendered table with headers and data rows
 */
const Table = <TRow extends object>({ rows }: TableProps<TRow>) => {
  const columnNames = Object.keys(rows[0]);

  return (
    <TableContainer>
      <TableMui sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columnNames.map((name, index) => (
              <TableCell key={index}>{name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, index) => (
                <TableCell key={index}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMui>
    </TableContainer>
  );
};

export default Table;
