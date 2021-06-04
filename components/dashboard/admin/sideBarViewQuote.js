import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import QuoteDetailAccordion from './quoteDetailAccordion';

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

export default function SideBarViewQuote({ data }) {
  // prepare data
  const summaryData = [];
  const {
    assignedTo,
    createdDate,
    ipAddress,
    status,
    progress,
    userId,
    price,
    quantity,
    leadtime,
  } = data;
  summaryData.push({ item: 'Customer', value: userId });
  summaryData.push({ item: 'IP', value: ipAddress });
  summaryData.push({ item: 'Created Date', value: createdDate });
  summaryData.push({ item: 'Status', value: status });
  summaryData.push({ item: 'Assigned To', value: assignedTo });

  summaryData.push({ item: 'Progress', value: progress });
  summaryData.push({ item: 'Leadtime', value: leadtime });
  summaryData.push({ item: 'Quantity', value: quantity });
  summaryData.push({ item: 'Price', value: price });

  const { suppliedAs, width, length, material, weight } = data;
  const specsData = [];
  specsData.push({ item: 'suppliedAs', value: suppliedAs });
  specsData.push({ item: 'width', value: width });
  specsData.push({ item: 'length', value: length });
  specsData.push({ item: 'material', value: material });
  specsData.push({ item: 'weight', value: weight });

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        square
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Grid container spacing={1} justify="space-between">
            <Typography>ID: {data.id}</Typography>
            <Typography>Amount: £{data.price * data.quantity}</Typography>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <QuoteDetailAccordion data={summaryData} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>quote specs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <QuoteDetailAccordion data={specsData} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>price detail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
