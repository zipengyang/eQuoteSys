import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import QuoteTemplate from './QuoteTemplate';
import OfferBadge from './OfferBadge';
import moment from 'moment';
import QuoteDetailTabs from '../landing/QuoteDetailTabs';
import { Grid } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  badge: {
    marginBottom: -200,

    border: `2px solid ${theme.palette.background.paper}`,
    padding: '100 40px',
  },
}));

export default function QuoteList({ data }) {
  let leadtimes = [];
  data.prices.map((item) => leadtimes.push(item.leadtime));

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <Grid container justify="flex-start">
            <Grid item container justify="flex-start" xs={4}>
              <Grid item xs={12}>
                Ref: {data.id.substring(0, 6)}
              </Grid>
              <Grid item xs={12}>
                {moment(data.createdDate.toDate()).format('MM/DD/YY')}
              </Grid>
              <Grid item xs={12}>
                {data.status}
              </Grid>
            </Grid>

            <Grid item container justify="flex-start" xs={8}>
              {data.prices.map((item, index) => (
                <Grid container item xs={12} key={index}>
                  <Grid item xs={4}>
                    {item.leadtime} days
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{
                      textDecoration:
                        item.status === 'amended' ? 'line-through' : 'none',
                    }}
                  >
                    £{item.price.toFixed(2)}
                  </Grid>
                  <Grid item xs={4}>
                    {item.status === 'amended' ? (
                      '£' + item.amendedPrice
                    ) : item.status === 'approved' ? (
                      <CheckIcon color="secondary" />
                    ) : item.status === 'rejected' ? (
                      <ClearIcon color="error" />
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {/* <QuoteTemplate /> */}
          <QuoteDetailTabs
            data={data}
            prices={data.prices}
            chosen={leadtimes}
          />
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button size="small">Cancel</Button>
          <Button size="small" color="primary">
            Save
          </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}
