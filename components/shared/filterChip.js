import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function FilterChip({ HandleAddChip }) {
  const classes = useStyles();

  const options = [
    { key: 1, label: 'contact' },
    { key: 2, label: 'leadtime' },
    { key: 3, label: 'quantity' },
    { key: 4, label: 'amount' },
    { key: 5, label: 'React' },
  ];

  return (
    <div className={classes.root}>
      {options.map((option) => (
        <Chip
          key={option.key}
          label={option.label}
          onClick={() => HandleAddChip(option)}
        />
      ))}
    </div>
  );
}
