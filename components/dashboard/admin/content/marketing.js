import { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import CampaignCard from '../../../marketing/Card';
import CampaignTable from '../../../marketing/CampaignTable';
import firebase from '../../../../firebase/firebase';

export default function Marketing({ statics }) {
  const { promotedQuotes, openedQuotes, acceptedQuotes } = statics;

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item xs={4}>
        <CampaignCard
          number={promotedQuotes}
          status={'All Promoted Quotes'}
          percentage={'100%'}
          icon={1}
        />
      </Grid>
      <Grid item xs={4}>
        <CampaignCard
          number={openedQuotes}
          status={'Opened'}
          percentage={`${((openedQuotes / promotedQuotes) * 100).toFixed(2)}%`}
          icon={2}
        />
      </Grid>
      <Grid item xs={4}>
        <CampaignCard
          number={acceptedQuotes}
          status={'Accepted'}
          percentage={`${((acceptedQuotes / promotedQuotes) * 100).toFixed(
            2,
          )}%`}
          icon={3}
        />
      </Grid>

      <Grid item xs={12}>
        <CampaignTable />
      </Grid>
    </Grid>
  );
}
