import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Grid } from '@material-ui/core';
import UploadFileInPortal from './UploadFileInPortal';
import getStripe from '../../utils/getStripe';
import firebase from '../../../firebase/firebase';
import { loadStripe } from '@stripe/stripe-js';

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

export default function QuoteTemplatePortal({
  rowData,
  handleClose,
  entrance,
}) {
  const classes = useStyles();

  const { id, quantity, price, leadtime, campaigns } = rowData;

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

  // handle payment

  const createStripeCheckout = firebase
    .functions()
    .httpsCallable('createStripeCheckout');
  // const stripe = getStripe();
  const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const handlePayment = () => {
    //pass invoiceTotal to cloud function for test purpose, will pass quoteid and get the amount in server side.
    createStripeCheckout(invoiceTotal).then((response) => {
      const sessionId = response.data.id;
      stripe.redirectToCheckout({ sessionId: sessionId });
    });
  };

  return (
    <>
      <Grid container direction="row" justify="center" spacing={2}>
        <Grid item xs={12}>
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
                  <TableCell align="right">
                    {ccyFormat(invoiceSubtotal)}
                  </TableCell>
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
          </TableContainer>
        </Grid>
        {entrance === 'submitted' && (
          <>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePayment()}
              >
                Pay
              </Button>
            </Grid>
          </>
        )}

        {entrance === 'draft' && (
          <Grid item xs={12}>
            <UploadFileInPortal
              quoteId={id}
              handleClose={handleClose}
              campaigns={campaigns}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
