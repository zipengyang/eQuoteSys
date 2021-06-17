import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useSpecContext } from './SpecContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
}));

export default function QuantityInput() {
  const classes = useStyles();
  // get state from context
  const { state, handleSpecChange } = useSpecContext();
  // update state by reducer
  const handleChange = (event) => {
    handleSpecChange(event.target.name, event.target.value);
  };
  return (
    <TextField
      label="Quantity"
      id="outlined-margin-normal"
      name="quantity"
      type="number"
      className={classes.textField}
      helperText="high volumn can be offshored"
      //   margin="normal"
      variant="outlined"
      defaultValue={state.quantity.value}
      onChange={handleChange}
    />
  );
}
