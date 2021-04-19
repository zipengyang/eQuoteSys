import { Grid } from '@material-ui/core';
import React from 'react';
import CampaignCard from '../../marketing/Card';

export default function Statics({ data, camps }) {
  const data_submitted = data.filter((items) => items.status === 'submitted');
  const data_draft = data.filter((items) => items.status === 'draft');
  const data_promoted = data.filter((items) => !!items.campaigns);
  const data_isClick = data.filter(
    (items) => !!items.campaigns && items.campaigns.isClicked === true,
  );
  const data_isAccepted = data.filter(
    (items) => !!items.campaigns && items.campaigns.isAccepted === true,
  );
  //   const campSelectedQuotes = data.filter(
  //     (items) => camps && items.campaigns.campaignId === camps.id,
  //   );

  //   const campQuotesClicked = campSelectedQuotes
  //     ? campSelectedQuotes.filter((items) => items.campaigns.isClicked === true)
  //     : null;
  //   const campQuotesAccepted = campSelectedQuotes
  //     ? campSelectedQuotes.filter((items) => items.campaigns.isAccepted === true)
  //     : null;

  const allQuotes = data.length;
  const submittedQuotes = data_submitted.length;
  const draftQuotes = data_draft.length;
  const promotedQuotes = data_promoted.length;
  const openedQuotes = data_isClick.length;
  const acceptedQuotes = data_isAccepted.length;
  // allUsers: users.length,

  //   const mStatics = {
  //     allQuotes: campSelectedQuotes ? campSelectedQuotes.length : 0,
  //     openedQuotes: campQuotesClicked ? campQuotesClicked.length : 0,
  //     acceptedQuotes: campQuotesAccepted ? campQuotesAccepted.length : 0,
  //   };

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
          number={promotedQuotes}
          status={'Promoted Quotes'}
          percentage={`${((promotedQuotes / allQuotes) * 100).toFixed(2)}%`}
          icon={2}
        />
      </Grid>

      <Grid item xs={3}>
        <CampaignCard
          number={openedQuotes}
          status={'Opened Promoted Quotes'}
          percentage={`${((openedQuotes / promotedQuotes) * 100).toFixed(2)}%`}
          icon={2}
        />
      </Grid>

      <Grid item xs={3}>
        <CampaignCard
          number={acceptedQuotes}
          status={'Accepted Promoted Quotes'}
          percentage={`${((acceptedQuotes / promotedQuotes) * 100).toFixed(
            2,
          )}%`}
          icon={2}
        />
      </Grid>

      {/* <Grid item xs={3}>
        <CampaignCard
          number={allUsers}
          status={'All Users'}
          //   percentage={`${ ( allQuotes / allUsers ).toFixed( 2 ) }`}
          percentage={'20%'}
          icon={4}
        />
      </Grid> */}
    </Grid>
  );
}
