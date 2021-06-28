import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useQuery } from 'react-query';
import { getSpecById } from '../../../pages/api/getSpec';

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

function createData(spec, value, unitPrice, amount, sum) {
  return { spec, value, unitPrice, amount, sum };
}

const rows = [
  createData('SuppliedAs', 'array', 0, 0, 0),
  createData('ccPerAarry', 6, 0, 0, 0),
  createData('Width', 262, 0, 0, 0),
  createData('Height', 305, 0, 0, 0),
  createData('Quantity', 356, 0, 0, 0),
  createData('Panel', 10, 9.2, 920, 920),
  createData('OverMake', 1, 9.2, 92, 1012),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function SpecsAndCalculatinTable({ quoteId }) {
  // const getCalsPrices = async () =>
  //      await Calculation( state );

  // console.log( calsPrices );

  const classes = useStyles();

  const { data, isLoading, isError } = useQuery(['spec', quoteId], getSpecById);
  if (isLoading) return '...loading';
  if (isError) return '...error';
  // console.log(data.cals);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Spec</StyledTableCell>
            <StyledTableCell align="right">Value</StyledTableCell>
            <StyledTableCell align="right">unitPrice</StyledTableCell>
            <StyledTableCell align="right">amount</StyledTableCell>
            <StyledTableCell align="right">sum</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.cals.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.spec}
              </StyledTableCell>
              <StyledTableCell align="right">{row.value}</StyledTableCell>
              <StyledTableCell align="right">{row.unitPrice}</StyledTableCell>
              <StyledTableCell align="right">
                {row.amount.toFixed(2)}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.sum.toFixed(2)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
