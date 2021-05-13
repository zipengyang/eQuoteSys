import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

function handleClick(event) {
  event.preventDefault();
  //   console.info('You clicked a breadcrumb.');
}

export default function TaskHeader({ task, assignedTo, due, isCompleted }) {
  const classes = useStyles();
  const displayCompletion = isCompleted ? <CheckIcon /> : 'In Progress';
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        color="inherit"
        href="/"
        onClick={handleClick}
        className={classes.link}
      >
        <AssignmentTurnedInIcon className={classes.icon} />
        task: {task}
      </Link>
      <Link
        color="inherit"
        href="/getting-started/installation/"
        onClick={handleClick}
        className={classes.link}
      >
        <PersonIcon className={classes.icon} />
        to: {assignedTo}
      </Link>
      <Link
        color="inherit"
        // href="/getting-started/installation/"
        onClick={handleClick}
        className={classes.link}
      >
        <DateRangeIcon className={classes.icon} />
        due: {due}
      </Link>
      <Typography color="textPrimary" className={classes.link}>
        <EventAvailableIcon className={classes.icon} />
        status: {displayCompletion}
      </Typography>
    </Breadcrumbs>
  );
}
