import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grid, IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import MessageIcon from '@material-ui/icons/Message';
import { HelpText } from './HelpText';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function HelperText({ field }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Grid container spacing={0} justify="space-around" alignItems="center">
        <Grid item xs={11}>
          <Typography variant="subtitle2">{HelpText[field].title}</Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={handleClick}>
            <InfoIcon />
          </IconButton>
        </Grid>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Typography className={classes.typography}>
            {HelpText[field].text}
          </Typography>
        </Popover>
      </Grid>
    </div>
  );
}
