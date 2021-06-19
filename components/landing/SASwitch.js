import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useSpecContext } from './SpecContext';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function SASwitch() {
  // get state from context
  const { state, handleSpecChange } = useSpecContext();
  // update state by reducer
  const handleChange = (event) => {
    handleSpecChange(event.target.name, event.target.checked);
  };

  return (
    <Typography component="div">
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>Single</Grid>
        <Grid item>
          <IOSSwitch
            checked={state.suppliedAs.value}
            onChange={handleChange}
            name="suppliedAs"
            disabled={state.activeStep.value > 0}
          />
        </Grid>
        <Grid item>Array</Grid>
      </Grid>
    </Typography>
  );
}
