import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomerActivityTimeLine from './CustomerActivityTimeLine';
import { useQuery } from 'react-query';
import { getUserActivity } from '../../../pages/api/getSpec';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function AccordionTimeLine({ user }) {
  const classes = useStyles();
  // console.log(user);
  const { data, isLoading, isError } = useQuery(
    ['activity', user.email],
    getUserActivity,
  );
  if (isLoading) return 'loading...';
  if (isError) return 'error...';

  // copy a new set of array removing duplicated date
  const groupArrayByDate = (arr) => [
    ...new Set(arr.map((e) => moment(e.date.toDate()).format('DD/MM/yyyy'))),
  ];
  const grouped = groupArrayByDate(data).sort().reverse();

  return (
    <div className={classes.root}>
      {grouped.map((date, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>{date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CustomerActivityTimeLine
              data={data.filter(
                (items) =>
                  moment(items.date.toDate()).format('DD/MM/yyy') === date,
              )}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
