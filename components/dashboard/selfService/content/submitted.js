import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import SubmittedQuoteTable from '../submittedQuoteTable';
import { useStyles } from '../../styles';
import clsx from 'clsx';

export default function Submitted() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart data={data} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Deposits data={data.length} type="submitted" />
        </Paper>
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <SubmittedQuoteTable />
      </Grid>
    </Grid>
  );
}
