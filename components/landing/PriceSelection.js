import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useSpecContext } from './SpecContext';
import { Button, Grid } from '@material-ui/core';
import { useQuery } from 'react-query';
import { getSpecById } from '../../pages/api/getSpec';

export default function PriceSelection() {
  const { state, handleSpecChange } = useSpecContext();
  const [value, setValue] = React.useState('none');

  const handleChange = (event) => {
    setValue(event.target.value);
    // update data
  };

  const quoteId = state.quoteId;

  // get data by state.quoteId from database  -- get price
  const { data, isLoading, isError } = useQuery(['spec', quoteId], getSpecById);

  if (isLoading) return '...loading';
  if (isError) return '...error';

  // console.log(data);

  return (
    <>
      <Grid container justify="center">
        <Grid item xs={12}>
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Prices</FormLabel> */}
            <RadioGroup
              aria-label="Prices"
              name="Price"
              value={value}
              onChange={handleChange}
            >
              {data &&
                data.leadtimeOption.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    label={`${item} dyas: -- £150 per circuit`}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="secondary">
            Choose and RFQ
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
