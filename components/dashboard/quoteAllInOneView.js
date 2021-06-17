import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import ActivityTab from './admin/activity/activityTab';
import SideBarViewQuote from './admin/sideBarViewQuote';

export default function QuoteAllInOneView({ data }) {
  console.log(data);
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper elevation={3}>
            <SideBarViewQuote data={data} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={5}>
            <ActivityTab user="crm@exceptionpcb.com" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3}>other info</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
