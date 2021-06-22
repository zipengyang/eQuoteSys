import { Container, Grid } from '@material-ui/core';
import CampDetail from './campDetail';
import CampaignCard from './Card';
import PromotedQuotesTable from './promotedQuotesTable';

export default function CampReport({ rowData, data }) {
  data = data.filter(
    (items) => !!items.campaigns && items.campaigns.campaignId === rowData.id,
  );
  const allQuotes = data.length;
  const openedQuotes = data.filter(
    (items) => items.campaigns.isClicked === true,
  ).length;

  const acceptedQuotes = data.filter(
    (items) => items.campaigns.isAccepted === true,
  ).length;

  return (
    <Container
    // maxWidth="false"
    >
      <Grid container spacing={3}>
        <Grid item container md={3}>
          <CampDetail data={rowData} />
        </Grid>
        <Grid item container md={9} spacing={3}>
          <Grid item xs={4} md={4}>
            <CampaignCard
              number={allQuotes}
              status={'All Promoted Quotes'}
              percentage={'100%'}
              icon={1}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <CampaignCard
              number={openedQuotes}
              status={'Opened'}
              percentage={`${((openedQuotes / allQuotes) * 100).toFixed(2)}%`}
              icon={2}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <CampaignCard
              number={acceptedQuotes}
              status={'Accepted'}
              percentage={`${((acceptedQuotes / allQuotes) * 100).toFixed(2)}%`}
              icon={3}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <PromotedQuotesTable data={data} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
