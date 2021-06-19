import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grid, IconButton } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function MoreOptions() {
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
      <IconButton onClick={handleClick}>
        <MessageIcon />
      </IconButton>

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
          We are here to help.
          <Grid container spacing={2} justify="space-between">
            <Grid item xs={4}>
              <Button variant="outlined" color="secondary" size="small">
                amend spec
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" color="secondary" size="small">
                start allover
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" color="secondary" size="small">
                contact us
              </Button>
            </Grid>
          </Grid>
        </Typography>
      </Popover>
    </div>
  );
}
