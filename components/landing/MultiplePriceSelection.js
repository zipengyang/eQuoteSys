import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import { useSpecContext } from './SpecContext';
import {
  Button,
  IconButton,
  Grid,
  Typography,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import MoreOptions from './MoreOptions';
import QuoteDetailTabs from './QuoteDetailTabs';
import router, { useRouter } from 'next/router';
import firebase from '../../firebase/firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

export default function MultiplePriceSelection({ prices, handlePanelChange }) {
  const classes = useStyles();
  prices.sort((a, b) => a.leadtime - b.leadtime);
  const router = useRouter();
  const { state, handleSpecChange } = useSpecContext();
  const activeStep = state.activeStep.value;
  const [checked, setChecked] = React.useState([]);
  const [Open, setOpen] = React.useState(false);

  const pricesToBeSaved = prices.filter((item) =>
    checked.includes(item.leadtime),
  );

  const handleClose = () => setOpen(!Open);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleSend = async () => {
    const ref = firebase.firestore().collection('specs');
    await ref
      .doc(state.quoteId)
      .update({
        status: 'priced',
        prices: pricesToBeSaved,
      })
      .then(() => {
        setOpen(!Open);
        handlePanelChange('requestForQuote');
        handleSpecChange('activeStep', 2);
        router.push('?create=true&progress=90');
      })
      .catch((err) => console.error(err));
  };

  // terms and condition
  const [termsAndCon, setTermsAndCon] = React.useState(false);
  const handleTCChange = () => {
    setTermsAndCon(!termsAndCon);
  };

  return (
    <>
      <Grid container spacing={2}>
        <List dense className={classes.root}>
          {prices &&
            prices.map((item) => {
              const labelId = `checkbox-list-secondary-label-${item}`;
              return (
                <ListItem key={item.leadtime} button>
                  <ListItemAvatar>
                    <Avatar className={classes.orange}>{item.leadtime}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={`days -- Unit Price:  £${item.price.toFixed(2)}`}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(item.leadtime)}
                      checked={checked.indexOf(item.leadtime) !== -1}
                      inputProps={{ 'aria-labelledby': labelId }}
                      disabled={activeStep >= 2}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
        </List>

        <Grid item xs={12} md={5}>
          <Button
            variant="contained"
            // style={{ color: '#52d869' }}
            color="secondary"
            fullWidth
            disabled={checked.length === 0 || activeStep >= 2}
            onClick={() => setOpen(!Open)}
          >
            View Quote Detail
          </Button>
        </Grid>

        <Grid item xs={12} md={7}>
          <MoreOptions />
        </Grid>
      </Grid>

      <Dialog
        fullWidth
        maxWidth="md"
        open={Open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={11}>
              <Typography>Quote Detail</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAndCon}
                    onChange={handleTCChange}
                    name="termsAndCon"
                    color="primary"
                  />
                }
                label={`Read and Accept T&Cs`}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Button
                variant="contained"
                color="secondary"
                // style={{ color: '#52d869' }}
                disabled={!termsAndCon}
                onClick={() => handleSend()}
              >
                Send Request For a Quote
              </Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
           
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <QuoteDetailTabs data={state} prices={prices} chosen={checked} />
        </DialogActions>
      </Dialog>
    </>
  );
}
