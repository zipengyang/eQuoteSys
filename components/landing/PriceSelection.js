import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useSpecContext } from './SpecContext';

export default function PriceSelection() {
  const { state, handleSpecChange } = useSpecContext();
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      {/* <FormLabel component="legend">Prices</FormLabel> */}
      <RadioGroup
        aria-label="Prices"
        name="Price"
        value={value}
        onChange={handleChange}
      >
        {state.leadtime.value.map((item, index) => (
          <FormControlLabel
            key={index}
            value={item}
            control={<Radio />}
            label={`${item} dyas: -- £150 per circuit`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
