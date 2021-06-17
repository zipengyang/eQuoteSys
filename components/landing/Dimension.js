import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Grid } from '@material-ui/core';
import { useSpecContext } from './SpecContext';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   margin: {
//     margin: theme.spacing(1),
//   },
//   withoutLabel: {
//     marginTop: theme.spacing(3),
//   },
//   textField: {
//     width: '25ch',
//   },
// }));

export default function Dimension() {
  //   const classes = useStyles();
  // get state from context
  const { state, handleSpecChange } = useSpecContext();
  // update state by reducer
  const handleChange = (event) => {
    handleSpecChange(event.target.name, event.target.value);
  };

  return (
    <>
      <Grid container spacing={2} justify="space-around" alignItems="center">
        <Grid item xs={5}>
          <TextField
            label="Height"
            id="dimension_height"
            name="height"
            type="number"
            // className={clsx(classes.margin, classes.textField)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">mm</InputAdornment>
              ),
            }}
            variant="outlined"
            defaultValue={state.height.value}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={1}>
          X
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Width"
            id="dimension_width"
            name="width"
            type="number"
            // className={clsx(classes.margin, classes.textField)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">mm</InputAdornment>
              ),
            }}
            variant="outlined"
            defaultValue={state.width.value}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
