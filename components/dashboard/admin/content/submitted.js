import { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import CampaignCard from '../../../marketing/Card';
import SubmittedQuoteTable from '../../../admin/SubmittedQuote';
import firebase from '../../../../firebase/firebase';

export default function Submitted({ data, statics }) {
  // count quote data
  const {
    allQuotes,
    submittedQuotes,
    draftQuotes,
    openedQuotes,
    acceptedQuotes,
    allUsers,
  } = statics;

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item xs={3}>
        <CampaignCard
          number={allQuotes}
          status={'All Quotes'}
          percentage={'100%'}
          icon={1}
        />
      </Grid>
      <Grid item xs={3}>
        <CampaignCard
          number={submittedQuotes}
          status={'Submitted Quotes'}
          percentage={`${((submittedQuotes / allQuotes) * 100).toFixed(2)}%`}
          icon={3}
        />
      </Grid>
      <Grid item xs={3}>
        <CampaignCard
          number={draftQuotes}
          status={'Draft Quotes'}
          percentage={`${((draftQuotes / allQuotes) * 100).toFixed(2)}%`}
          icon={2}
        />
      </Grid>
      <Grid item xs={3}>
        <CampaignCard
          number={allUsers}
          status={'All Users'}
          percentage={`${(allQuotes / allUsers).toFixed(2)}`}
          icon={4}
        />
      </Grid>

      <Grid item xs={12}>
        <SubmittedQuoteTable data={data} />
      </Grid>
    </Grid>
  );
}
