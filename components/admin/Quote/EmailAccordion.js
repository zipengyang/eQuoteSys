import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import firebase from '../../../firebase/firebase';
import { QueryClient, useQueryClient } from 'react-query';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 'bold',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),

    color: theme.palette.text.secondary,
  },
}));

export default function EmailAccordion({ data, quoteId }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const queryClient = useQueryClient();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeFiling = async (email) => {
    const updatedQuoteId = email.quoteId === '' ? quoteId : '';
    const ref = firebase.firestore().collection('timelineLog');

    await ref
      .doc(email.id)
      .update({ quoteId: updatedQuoteId })
      .then(() => {
        queryClient.invalidateQueries('timelineLog');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={classes.root}>
      {data &&
        data.map((email) => (
          <Accordion
            key={email.id}
            expanded={expanded === email.id}
            onChange={handleChange(email.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography className={classes.heading}>
                    Subject: {email.title}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  <Typography className={classes.secondaryHeading}>
                    {moment(email.date.toDate()).format('DD/MM/yy')}{' '}
                    {moment(email.date.toDate()).format('hh:mm A')}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={email.quoteId === '' ? false : true}
                        onChange={() => handleChangeFiling(email)}
                        name="FileToQuote"
                      />
                    }
                    label="File it to this quote"
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{email.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
