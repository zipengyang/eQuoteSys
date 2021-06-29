import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Button, Grid, Typography } from '@material-ui/core';

const TAX_RATE = 0.2;

const useStyles = makeStyles({
  table: {
    minWidth: 480,
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

export default function QuoteDetail({ data, prices, chosen }) {
  const qty =
    typeof data.quantity === 'object' ? data.quantity.value : data.quantity;
  const classes = useStyles();
  // console.log(chosen);
  const priceObj = prices.find((price) => price.leadtime === chosen);
  // .price.toFixed(2);
  const price =
    priceObj.status === 'amended'
      ? priceObj.amendedPrice
      : priceObj.price.toFixed(2);

  const result = prices.find((price) => price.leadtime === chosen);
  let rows = [];
  rows = [
    createRow(`PCB - ${chosen} days `, qty, price),
    createRow('Tooling', 1, 260.0),
    createRow('Shipment', 1, 20.0),
  ];
  // console.log(data.campaign)
  if (data.campaigns !== undefined) {
    const { type, offer } = data.campaigns;

    const offerAmount =
      type === 'fixed'
        ? Number(offer)
        : ((price * data.quantity + 260 + 20) * offer) / 100;
    const discountDesc =
      type === 'fixed'
        ? `discount -- ${offer} off`
        : `discount -- ${offer}% off`;
    rows.push(createRow(discountDesc, 1, -ccyFormat(offerAmount)));
  }

  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  return (
    <>
      <Grid container direction="row" justify="center" spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={2}>
                    Details
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    Price(£)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Desc</TableCell>
                  <TableCell align="left">Qty.</TableCell>
                  <TableCell align="left">Unit Price</TableCell>
                  <TableCell align="left">Sum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.desc}>
                    <TableCell>{row.desc}</TableCell>
                    <TableCell align="left">{row.qty}</TableCell>
                    <TableCell align="left">{row.unit}</TableCell>
                    <TableCell align="left">{ccyFormat(row.price)}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={5}>
                    {data.status !== 'initiated' &&
                      data.status !== 'submitted' && (
                        <Box
                          width="auto"
                          boxShadow={3}
                          bgcolor="grey.300"
                          p={1}
                          style={{ width: '5rem', height: '2.5rem' }}
                        >
                          <Typography>{result.status}</Typography>
                        </Box>
                      )}
                  </TableCell>
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="left">
                    {ccyFormat(invoiceSubtotal)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VAT</TableCell>
                  <TableCell align="left">{`${(TAX_RATE * 100).toFixed(
                    0,
                  )} %`}</TableCell>
                  <TableCell align="left">{ccyFormat(invoiceTaxes)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="left">{ccyFormat(invoiceTotal)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Typography>Terms and Condition: </Typography>
        </Grid>
      </Grid>
    </>
  );
}
