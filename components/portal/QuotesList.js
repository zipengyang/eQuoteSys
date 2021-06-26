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
import { Badge, Grid } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import firebase from '../../firebase/firebase';
import { loadStripe } from '@stripe/stripe-js';
import { useQueryClient } from 'react-query';
import { addTimeLineLog } from '../../pages/api/getSpec';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 173,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function QuoteList({ data }) {
  let leadtimes = [];
  data.prices.map((item) => leadtimes.push(item.leadtime));
  const approvedPrices = data.prices.filter(
    (items) => items.status !== 'rejected',
  );
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [choice, setChoice] = React.useState({});
  const queryClient = useQueryClient();
  // const [status, setStatus] = React.useState('');
  const handleClick = (event) => {
    setChoice(
      approvedPrices.find((item) => item.leadtime === event.target.value),
    );
  };

  const handleAccept = () => {
    // this will be in cloud function
    let selectedPrice =
      choice.statu === 'amended'
        ? parseInt(choice.amendedPrice * data.quantity)
        : parseInt(choice.price * data.quantity);
    // temporary hard code tooling and vat
    selectedPrice = (selectedPrice + 260 + 20) * 1.2;

    if (choice.status === 'proforma') {
      // call stripe api
      const createStripeCheckout = firebase
        .functions()
        .httpsCallable('createStripeCheckout');
      // const stripe = getStripe();
      const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const paymentInfo = { quoteId: data.id, amount: selectedPrice };
      createStripeCheckout(paymentInfo)
        .then((response) => {
          const sessionId = response.data.id;
          stripe.redirectToCheckout({ sessionId: sessionId });
        })
        .then(() => {
          // temporary update state here, should be in cloud function
          const ref = firebase.firestore().collection('specs');
          ref
            .doc(data.id)
            .update({ status: 'paid', acceptedPrice: choice })
            .then(() => {
              queryClient.invalidateQueries('specs');
            })
            // .then(() => {
            //   firebase.firestore().collection('activityLog').doc().set({
            //     userId: data.userId,
            //     quoteId: data.id,
            //     title: 'quote paid',
            //     date: firebase.firestore.FieldValue.serverTimestamp(),
            //   });
            // })
            .then(() => {
              addTimeLineLog(
                data.id,
                data.userId,
                'Quote',
                'Quote Paid',
                '',
                '',
              );
            })
            .catch((err) => console.error(err));
        });
    } else {
      // update database here.
      const ref = firebase.firestore().collection('specs');
      ref
        .doc(data.id)
        .update({
          status: 'accepted',
          acceptedDate: firebase.firestore.FieldValue.serverTimestamp(),
          acceptedPrice: choice,
        })
        .then(() => {
          queryClient.invalidateQueries('specs');
        })
        .then(() => {
          addTimeLineLog(
            data.id,
            data.userId,
            'Quote',
            'Quote Accepted',
            '',
            '',
          );
        })
        .catch((err) => console.error(err));
    }
  };
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
                {data.campaigns !== undefined && (
                  <Badge color="secondary" badgeContent="offer" size="small" />
                )}
                Ref: {data.id.substring(0, 6)}
              </Grid>
              <Grid item xs={12}>
                {moment(data.createdDate.toDate()).format('MM/DD/YY')}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  style={{
                    color:
                      data.status === 'quoted'
                        ? 'red'
                        : data.status === 'accepted' || data.status === 'paid'
                        ? 'green'
                        : '',
                  }}
                >
                  {data.status}
                </Typography>
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
                    ) : item.status === 'proforma' ? (
                      <AttachMoneyIcon />
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
        {/* choose one leadtime & price to submit */}
        {data.status === 'quoted' && (
          <>
            <AccordionActions>
              <Grid container item justify="center">
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Choose Your Price
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={choice.leadtime}
                    onChange={handleClick}
                    label="Price"
                  >
                    {approvedPrices &&
                      approvedPrices.map((item, index) => (
                        <MenuItem value={item.leadtime} key={index}>
                          {item.leadtime} days @ £
                          {item.status === 'amended'
                            ? item.amendedPrice
                            : item.price.toFixed(2)}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <Button size="small" color="primary" onClick={handleAccept}>
                  {choice.status === 'proforma'
                    ? 'Payment Required'
                    : 'Accept and Send'}
                </Button>
              </Grid>
            </AccordionActions>
          </>
        )}
      </Accordion>
    </div>
  );
}
