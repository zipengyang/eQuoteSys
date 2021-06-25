import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Avatar, Grid, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import DetailsTab from './DetailsTab';
import moment from 'moment';
import { useQuery } from 'react-query';
import { getUser } from '../../../pages/api/getSpec';
import QuoteSummaryCard1 from './quoteSummaryCard1';
import QuoteSummaryCard2 from './quoteSummaryCard2';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function QuoteSummaryTab({ data }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // get user info
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(['users', data.userId], getUser);

  if (isLoading) return '...loading';
  if (isError) return '...error';
  console.log(user);

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        // variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Summary" {...a11yProps(0)} />
        <Tab label="Specification" {...a11yProps(0)} />
        <Tab label="Calculation" {...a11yProps(1)} />
        <Tab label="Prices" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={6}>
            <QuoteSummaryCard1 user={user} />
          </Grid>
          <Grid item xs={6}>
            <QuoteSummaryCard2 data={data} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Specification
      </TabPanel>
      <TabPanel value={value} index={2}>
        Calculation detail
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DetailsTab data={data} />
      </TabPanel>
    </div>
  );
}
