import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import QuoteDetail from './QuoteDetail';
import { Grid } from '@material-ui/core';
import QuotePrice from './QuotePrice';

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
  console.log(data);
  // const leadTimes =
  //   chosen.sort((a, b) => a - b);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
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
            />
          </TabPanel>
        ))}
    </div>
  );
}
