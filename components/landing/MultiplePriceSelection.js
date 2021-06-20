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
import { Button, Grid, Typography } from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

import { CustomizedDialog } from '../shared/customizedDialog';
import MoreOptions from './MoreOptions';
import QuoteDetailTabs from './QuoteDetailTabs';

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
  const { state, handleSpecChange } = useSpecContext();
  const [checked, setChecked] = React.useState([]);
  const [Open, setOpen] = React.useState(false);

  // console.log(checked);
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
  const handleSend = () => {
    setOpen(!Open);
    handlePanelChange('requestForQuote');
    handleSpecChange('activeStep', 2);
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
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
        </List>

        <Grid item xs={4}>
          <Button
            variant="outlined"
            color="secondary"
            disabled={checked.length === 0}
            onClick={() => setOpen(!Open)}
          >
            Quote Detail
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            {`Can't find what your want? click me-->`}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <MoreOptions />
        </Grid>
      </Grid>
      <CustomizedDialog
        isOpen={Open}
        handleClose={handleClose}
        title={
          <Grid container spacing={3}>
            <Grid item>Quote Detail</Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSend()}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        }
        subtitle=""
        children={
          <QuoteDetailTabs data={state} prices={prices} chosen={checked} />
        }
      />
    </>
  );
}
