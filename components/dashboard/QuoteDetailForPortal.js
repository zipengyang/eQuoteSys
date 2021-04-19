import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useQuery } from 'react-query';
import { getSpec } from '../../pages/api/getSpec';
import { Button } from '@material-ui/core';
import UploadFileInPortal from './selfService/UploadFileInPortal';

const TAX_RATE = 0.2;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

export default function QuoteDetailForPortal({ quoteid, menuClicked }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const { data, status } = useQuery(['spec', { quoteid }], getSpec);
  if (status === 'loading') return <p>loading...</p>;
  if (status === 'error') return <p>error...</p>;

  const { quantity, price, leadtime, campaigns } = data;
  console.log(campaigns);

  let rows = [];
  if (campaigns) {
    const { type, offer } = campaigns;
    const offerAmount =
      type === 'fixed' ? offer : (price * quantity * offer) / 100;
    const discountDesc =
      type === 'fixed'
        ? `discount -- ${offer} off`
        : `discount -- ${offer}% off`;
    rows = [
      createRow(
        `PCB - ${leadtime} days - onShore manufacturing`,
        quantity,
        price,
      ),
      createRow('Front End Tooling', 1, 260.0),
      createRow('Freight Received', 1, 20.0),
      createRow(discountDesc, 1, -offerAmount),
    ];
  } else {
    rows = [
      createRow(
        `PCB - ${leadtime} days - onShore manufacturing`,
        quantity,
        price,
      ),
      createRow('Front End Tooling', 1, 260.0),
      createRow('Freight Received', 1, 20.0),
    ];
  }

  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3}>
                Details
              </TableCell>
              <TableCell align="right">Price(£)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Desc</TableCell>
              <TableCell align="right">Qty.</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Sum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.desc}>
                <TableCell>{row.desc}</TableCell>
                <TableCell align="right">{row.qty}</TableCell>
                <TableCell align="right">{row.unit}</TableCell>
                <TableCell align="right">{ccyFormat(row.price)}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tax</TableCell>
              <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
                0,
              )} %`}</TableCell>
              <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button variant="outlined" color="primary" onClick={handleClick}>
          Submit
        </Button>
      </TableContainer>
      {open && (
        <UploadFileInPortal
          quoteId={quoteid}
          menuClicked={menuClicked}
          campaigns={campaigns}
        />
      )}
    </>
  );
}
