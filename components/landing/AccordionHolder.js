import React, { useCallback, useState, useReducer } from 'react';
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
  // const [state, dispatch] = useReducer(SpecReducer, DEFAULT_STATE);

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
  // if (state.quantity.value > 0) {
  //   setPriceIsReady(true);
  // }

  const [expanded, setExpanded] = React.useState('specs');
  const handlePanelChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleRevealButton = () => {
    setIsLoading(true);
    setTimeout(() => setPriced(true), 3000);
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
                  disabled={state.quantity.value === ''} // tempoary.
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
