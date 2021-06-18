import React, { useCallback, useState, useReducer, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  console.log(state);
  const [suppAsArray, setSuppAsArray] = useState(false);
  const [priceIsReady, setPriceIsReady] = useState(false);
  const [priced, setPriced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // check if all required fields completed.
  useEffect(() => {
    if (
      state.height.value !== '' &&
      state.width.value !== '' &&
      state.quantity.value !== '' &&
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
    // update data and get price  -- will use cloud function instead.
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
      })
      .then(() => {
        // will get price here by calling cloud function
        setIsLoading(true);
        setTimeout(() => setPriced(true), 3000);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <div className={classes.root}>
        <SpecProvider value={{ state, handleSpecChange }}>
          <Accordion
            square
            expanded={expanded === 'specs'}
            onChange={handlePanelChange('specs')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>PCB Specs</Typography>
            </AccordionSummary>
            {/* SpecContext start here */}

            <AccordionDetails>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12}>
                  <CardHolder
                    field="suppliedAs"
                    state={suppAsArray}
                    handleStateChange={setSuppAsArray}
                  />
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
                {/* )} */}
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
            expanded={expanded === 'pricing'}
            onChange={handlePanelChange('pricing')}
          >
            <AccordionSummary
              expandIcon={priced && <ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              {!priced && (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={!priceIsReady}
                  size="large"
                  onClick={() => handleRevealButton()}
                >
                  {!isLoading && 'Reveal Price'}
                  {isLoading && <CircularProgress color="inherit" />}
                </Button>
              )}
              {priced && <Typography>Price detail</Typography>}
            </AccordionSummary>
            <AccordionDetails>{priced && <PriceSelection />}</AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'requestForQuote'}
            onChange={handlePanelChange('requestForQuote')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>Request Quote</Typography>
            </AccordionSummary>
            <AccordionDetails>{priced && <ContactForm />}</AccordionDetails>
          </Accordion>
        </SpecProvider>
      </div>
    </>
  );
}
