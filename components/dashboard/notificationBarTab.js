import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NotificationQuoteCard from './notificationQuoteCard';
import NotificationTaskCard from './notificationTaskCard';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 350,
  },
}));

export default function NotificationBarTab({
  quotes,
  tasks,
  handleDrawerClose,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const quotesLength = quotes ? quotes.length : 0;
  const tasksLength = tasks ? tasks.length : 0;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          <Tab label={`Quote(${quotesLength})`} {...a11yProps(0)} />
          <Tab label={`Task(${tasksLength})`} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {quotes &&
            quotes.map((item) => (
              <NotificationQuoteCard
                key={item.id}
                data={item}
                handleDrawerClose={handleDrawerClose}
              />
            ))}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {tasks &&
            tasks.map((item) => (
              <NotificationTaskCard
                key={item.id}
                data={item}
                handleDrawerClose={handleDrawerClose}
              />
            ))}
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
