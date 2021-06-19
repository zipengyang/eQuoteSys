import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { useSpecContext } from './SpecContext';

export default function MaterialSelection() {
  // get state from context
  const { state, handleSpecChange } = useSpecContext();
  // update state by reducer
  const handleChange = (event) => {
    handleSpecChange(event.target.name, event.target.value);
  };

  // const handleChange = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Material</FormLabel>
      <RadioGroup
        aria-label="material"
        name="material"
        value={state.material.value}
        onChange={handleChange}
      >
        <Grid container>
          <FormControlLabel
            value="fr4"
            control={<Radio disabled={state.activeStep.value > 0} />}
            label="FR-4"
          />
          <FormControlLabel
            value="rogers"
            control={<Radio disabled={state.activeStep.value > 0} />}
            label="Rogers"
          />
          <FormControlLabel
            value="flex"
            control={<Radio disabled={state.activeStep.value > 0} />}
            label="flex"
          />
          <FormControlLabel
            value="other"
            control={<Radio disabled={state.activeStep.value > 0} />}
            label="other"
          />
        </Grid>
      </RadioGroup>
    </FormControl>
  );
}
