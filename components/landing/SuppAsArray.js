import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import { useSpecContext } from './SpecContext';

export default function SuppAsArray() {
  // get state from context
  const { state, handleSpecChange } = useSpecContext();
  // update state by reducer
  const handleChange = (event) => {
    handleSpecChange(event.target.name, event.target.value);
  };

  const handlexOutChange = (event) => {
    handleSpecChange(event.target.name, event.target.checked);
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField
            id="circuits-number"
            label="Circuits Per Array"
            type="number"
            variant="outlined"
            name="ccPerArray"
            disabled={state.activeStep.value > 0}
            defaultValue={state.ccPerArray.value}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.xOut.value}
                onChange={handlexOutChange}
                disabled={state.activeStep.value > 0}
                name="xOut"
                color="primary"
              />
            }
            label="Xout"
          />
        </Grid>
      </Grid>
    </>
  );
}
