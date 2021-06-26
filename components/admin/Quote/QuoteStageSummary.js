import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import monent from 'moment';
import PinDropIcon from '@material-ui/icons/PinDrop';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function QuoteStageSummary({ data }) {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : true);
  };

  return (
    <div>
      <Accordion
        square
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Grid container justify="flex-start">
            <Grid item xs={11}>
              <Typography>Quote Submission</Typography>
            </Grid>
            <Grid item xs={1}>
              {data.status === 'submitted' && <PinDropIcon color="secondary" />}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} justify="flex-start">
            <Grid item xs={12}>
              <Typography>
                ID: {'  '}
                {data.id}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Date:{'  '}
                {monent(data.createdDate.toDate()).format('DD/MM/yy HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Quantity:{'  '}
                {data.quantity}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {data.prices.map((item) => (
                <Typography key={item.leadtime}>
                  LeadTime:{'  '}
                  {item.leadtime} days @ {item.price.toFixed(2)}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded
        // ={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Grid container justify="flex-start">
            <Grid item xs={11}>
              <Typography>Quote Approval</Typography>
            </Grid>
            <Grid item xs={1}>
              {data.status === 'quoted' && <PinDropIcon color="secondary" />}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} justify="flex-start">
            <Grid item xs={12}>
              <Typography>
                Assigned To:{'  '}
                {data.assignedTo}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Quote issued Date:{'  '}
                {data.status === 'quoted' &&
                  monent(data.quotedDate.toDate()).format('DD/MM/yy HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {data.prices.map((item) => (
                <Typography key={item.leadtime}>
                  LeadTime:{'  '}
                  {item.leadtime} days @ {item.price.toFixed(2)} {'  '}{' '}
                  {item.status}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded
        // ={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Grid container justify="flex-start">
            <Grid item xs={11}>
              <Typography>Quote Acceptance</Typography>
            </Grid>
            <Grid item xs={1}>
              {(data.status === 'accepted' || data.status === 'paid') && (
                <PinDropIcon color="secondary" />
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} justify="flex-start">
            <Grid item xs={12}>
              <Typography>
                Accepted Date:{'  '}
                {data.status === 'accepted' &&
                  monent(data.acceptedDate.toDate()).format('DD/MM/yy HH:mm')}
              </Typography>
              <Typography>
                Accepted Item:{'  '}
                {/* {console.log(data.acceptedPrice)} */}
                LeadTime: {data.acceptedPrice.leadtime} days @{' '}
                {data.acceptedPrice.status === 'amended'
                  ? data.acceptedPrice.amendedPrice
                  : data.acceptedPrice.price.toFixed(2)}
              </Typography>

              {/* <Typography>
                {data.acceptedPrice.status === 'amended' &&
                  data.acceptedPrice.amendedPrice.toFixed(2)}
              </Typography> */}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
