import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import moment from 'moment';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits({ data, type }) {
  const classes = useStyles();
  const toDate = moment(Date.now()).format('DD/MM/YYYY');
  const fromDate = moment().add(-1, 'months').format('DD/MM/YYYY');
  return (
    <React.Fragment>
      <Title>Total {type} quotes</Title>
      <Typography component="p" variant="h4">
        {data}
      </Typography>

      <Typography color="textSecondary" className={classes.depositContext}>
        {fromDate} -- {toDate}
      </Typography>
      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div> */}
    </React.Fragment>
  );
}
