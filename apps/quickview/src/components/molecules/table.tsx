import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table as TableMui,
  TableRow,
} from '@mui/material';

type TableProps<TRow extends object> = {
  rows: TRow[];
};

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
