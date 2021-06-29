import React, { useCallback, useState, useReducer, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LockIcon from '@material-ui/icons/Lock';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import {
  Grid,
  Paper,
  Avatar,
  IconButton,
  Button,
  Collapse,
  Slide,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardHolder from './CardHolder';
import PriceSelection from './PriceSelection';
import ContactForm from './ContactForm';
import { useImmerReducer } from 'use-immer';
import { DEFAULT_STATE, SpecReducer } from './SpecStateReducer';
import { SpecProvider } from './SpecContext';
import firebase from '../../firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import publicIp from 'public-ip';
// import Calculation from '../utils/testCal';
import MultiplePriceSelection from './MultiplePriceSelection';
import { useRouter } from 'next/router';
import { Calculation } from '../utils/testCal';

const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: 400,
    // maxWidth: 428,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function AccordionHolder() {
  const classes = useStyles();

  const [state, dispatch] = useImmerReducer(SpecReducer, DEFAULT_STATE);

  const [ip, setIp] = useState();
  const getIP = async () => {
    setIp(await publicIp.v4());
  };
  getIP();

  const handleSpecChange = useCallback(
    (name, newValue) => {
      // const error = validateInput(name, newValue);
      dispatch({
        key: name,
        payload: { newValue },
      });
    },
    [dispatch],
  );

  const [priceIsReady, setPriceIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prices, setPrices] = useState([]);
  const router = useRouter();
  const activeStep = state.activeStep.value;

  //check if all required fields completed.
  useEffect(() => {
    if (
      state.height.value > 0 &&
      state.width.value > 0 &&
      state.quantity.value > 0 &&
      state.material.value !== '' &&
      state.leadtime.value !== []
    ) {
      setPriceIsReady(true);
    } else {
      setPriceIsReady(false);
    }
    return () => {
      priceIsReady;
    };
  }, [state]);

  const [expanded, setExpanded] = React.useState('specs');
  const handlePanelChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleRevealButton = async () => {
    setIsLoading(true); // set loading true while waiting

    const calsPrices = await Calculation(state);
    // console.log(calsPrices);
    setPrices(calsPrices.prices);

    const ref = firebase.firestore().collection('specs');
    await ref
      .doc(state.quoteId)
      .set({
        suppliedAs: state.suppliedAs.value === false ? 'single' : 'array',
        ccPerArray: state.ccPerArray.value,
        xOut: state.xOut.value,
        height: state.height.value,
        width: state.width.value,
        layer: state.layer.value,
        material: state.material.value,
        leadtimeOption: state.leadtime.value,
        quantity: state.quantity.value,
        ipAddress: ip,
        createdDate: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'initiated',
        cals: calsPrices.calArray, // temorary here
      })
      // .then(() => {
      //call cloud function
      // const addCalculation = firebase
      //   .functions()
      //   .httpsCallable('addCalculation');
      // addCalculation(state)
      // call cal function

      // .then((result) => setPrices(result.data))
      // .catch((err) => console.error(err));
      //   console.log('used to call cloud function');
      // })
      .then(() => {
        handleSpecChange('activeStep', 1);
      })
      .then(() => {
        setIsLoading(false);
        setPriceIsReady(false);
        router.push('?create=true&progress=60');
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <div className={classes.root}>
        <SpecProvider value={{ state, handleSpecChange }}>
          <Accordion
            square
            expanded={router.query.create === 'true' && expanded === 'specs'}
            onChange={handlePanelChange('specs')}
          >
            <AccordionSummary
              expandIcon={
                router.query.create !== 'true' ? (
                  <LockIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon />
                )
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                Step 1: PCB Specs
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12}>
                  <CardHolder field="suppliedAs" />
                </Grid>
                {/* {state.suppliedAs.value && ( */}
                <Slide
                  direction="up"
                  in={state.suppliedAs.value}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid item xs={12}>
                    <CardHolder field="suppliedAsArray" />
                  </Grid>
                </Slide>

                <Grid item xs={12}>
                  <CardHolder field="dimension" />
                </Grid>
                <Grid item xs={12}>
                  <CardHolder field="layer" />
                </Grid>
                <Grid item xs={12}>
                  <CardHolder field="material" />
                </Grid>
                <Grid item xs={12}>
                  <CardHolder field="soldermask" />
                </Grid>
                <Grid item xs={12}>
                  <CardHolder field="leadtime" />
                </Grid>
                <Grid item xs={12}>
                  <CardHolder field="quantity" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={activeStep >= 1 && expanded === 'pricing'}
            onChange={handlePanelChange('pricing')}
          >
            <AccordionSummary
              expandIcon={
                activeStep < 1 ? (
                  <LockIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon />
                )
              }
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              {priceIsReady && activeStep === 0 ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => handleRevealButton()}
                >
                  {!isLoading && 'Step Two: Reveal Price'}
                  {isLoading && <CircularProgress color="inherit" />}
                </Button>
              ) : (
                <Typography className={classes.heading}>
                  Step 2: Price Detail
                </Typography>
              )}
            </AccordionSummary>

            {/* display price  */}
            {activeStep >= 0 && (
              // <PriceSelection
              <AccordionDetails>
                <MultiplePriceSelection
                  prices={prices}
                  handlePanelChange={setExpanded}
                />
              </AccordionDetails>
            )}
          </Accordion>

          <Accordion
            square
            expanded={activeStep >= 2 && expanded === 'requestForQuote'}
            onChange={handlePanelChange('requestForQuote')}
          >
            <AccordionSummary
              expandIcon={
                activeStep < 2 ? (
                  <LockIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon />
                )
              }
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>
                Step 3: Request Quote
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {activeStep >= 2 && <ContactForm />}
            </AccordionDetails>
          </Accordion>
        </SpecProvider>
      </div>
    </>
  );
}
