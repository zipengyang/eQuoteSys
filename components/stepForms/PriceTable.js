import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(ref, quantity, unitPrice, leadTime, Tooling, Total) {
  return { ref, quantity, unitPrice, leadTime, Tooling, Total };
}

const rows = [
  createData('242876-Q-1', 100, 3.78, '12 Days', 260, 638.0),
  createData('242876-Q-2', 1000, 3.3, '20 Days', 260, 3560.0),
  createData('242876-Q-3', 5000, 3.04, '25 Days', 260, 15460.0),
  createData('242876-Q-4', 10000, 2.48, 'Scheduled', 260, 248260.0),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function PriceTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Quote Ref</StyledTableCell>
            <StyledTableCell align="right">Quantity</StyledTableCell>
            <StyledTableCell align="right">Unit Price</StyledTableCell>
            <StyledTableCell align="right">LeadTime</StyledTableCell>
            <StyledTableCell align="right">Tooling</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.ref}>
              <StyledTableCell component="th" scope="row">
                {row.ref}
              </StyledTableCell>
              <StyledTableCell align="right">{row.quantity}</StyledTableCell>
              <StyledTableCell align="right">{row.unitPrice}</StyledTableCell>
              <StyledTableCell align="right">{row.leadTime}</StyledTableCell>
              <StyledTableCell align="right">{row.Tooling}</StyledTableCell>
              <StyledTableCell align="right">{row.Total}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
