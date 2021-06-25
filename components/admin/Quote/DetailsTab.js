import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import QuoteDetail from './QuoteDetail';
import { Button, Grid, Paper } from '@material-ui/core';
import QuotePrice from './QuotePrice';
import ActionForm from './ActionForm';
import firebase from '../../../firebase/firebase';
import { useQueryClient } from 'react-query';
import { UpdateRounded } from '@material-ui/icons';
import { addActivityLog } from '../../../pages/api/getSpec';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box m={1}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function DetailsTab({ data }) {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [value, setValue] = React.useState(0);
  const [prices, setPrices] = React.useState([]);

  let actionArray = data.prices;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onSubmit = (data) => {
    actionArray[value].status = data.status;
    if (data.status === 'amended') {
      actionArray[value].amendedPrice = data.amendedPrice;
    } else {
      actionArray[value].amendedPrice = '';
    }
    setPrices(actionArray);
  };

  const handleApproval = async () => {
    const invalidStatus = prices.filter((items) => items.status === '');
    if (invalidStatus.length > 0) {
      return window.alert('there is action uncompleted');
    } else {
      // update database
      const ref = firebase.firestore().collection('specs');
      await ref
        .doc(data.id)
        .update({ status: 'quoted', prices })
        .then(() => {
          queryClient.invalidateQueries('specs');
          //call cloud function
          const QuoteUpdatedEmail = firebase
            .functions()
            .httpsCallable('QuoteUpdatedEmail');
          QuoteUpdatedEmail(data.userId);
        })
        .then(() => {
          // const title = 'quote sent';
          // addActivityLog(data.quoteId, data.userId, title);
          firebase.firestore().collection('activityLog').doc().set({
            userId: data.userId,
            quoteId: data.id,
            title: 'quote sent',
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        })
        .then(() => window.alert('quote sent.'))
        .catch((err) => console.error(err));
    }
  };

  return (
    <Grid container spacing={2}>
      {/* <div className={classes.root}> */}
      <Grid item xs={12}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="quoteDetailTabsByLeadTime"
          >
            {data &&
              data.prices.map((item) => (
                <Tab
                  key={item.leadtime}
                  label={`${item.leadtime} days`}
                  {...a11yProps(item.leadtime)}
                />
              ))}
          </Tabs>
        </AppBar>

        {data &&
          data.prices.map((item, index) => (
            <TabPanel value={value} index={index} key={index}>
              <QuotePrice
                qty={data.quantity}
                price={item.price}
                leadtime={item.leadtime}
                updatePrices={prices}
                campaigns={data.campaigns !== undefined ? data.campaigns : ''}
              />
              <Paper
                elevation={3}
                style={{ marginTop: 10, marginBottom: 10, padding: 10 }}
              >
                <ActionForm
                  onSubmit={onSubmit}
                  prices={item}
                  status={data.status}
                />
              </Paper>
            </TabPanel>
          ))}
        {/* </div> */}
      </Grid>
      <Grid item container xs={12} justify="center">
        <Button variant="contained" color="secondary" onClick={handleApproval}>
          send quote
        </Button>
      </Grid>
    </Grid>
  );
}
