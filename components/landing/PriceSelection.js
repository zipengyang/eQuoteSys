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
import { CustomizedDialog } from '../shared/customizedDialog';
// import QuoteTemplate from '../portal/QuoteTemplate';
import QuoteDetail from './QuoteDetail';
import { useRouter } from 'next/router';

export default function PriceSelection({
  prices,
  handlePanelChange,
  // handleStep,
}) {
  prices.sort((a, b) => a.leadtime - b.leadtime);
  const { state, handleSpecChange } = useSpecContext();
  const router = useRouter();
  const [value, setValue] = React.useState('none');
  const [Open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(!Open);
  const handleChange = (event) => {
    setValue(event.target.name, event.target.value);
  };

  const handleSend = () => {
    setOpen(!Open);
    handlePanelChange('requestForQuote');
    handleSpecChange('activeStep', 2);
  };

  return (
    <>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Prices</FormLabel> */}
            <RadioGroup
              aria-label="Prices"
              name="Price"
              value={value}
              onChange={handleChange}
            >
              {prices &&
                prices.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    name={item.leadtime}
                    value={item.leadtime}
                    control={<Radio />}
                    label={`${item.leadtime} dyas: -- £${item.price.toFixed(
                      2,
                    )} per circuit`}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpen(!Open)}
          >
            Quote Detail
          </Button>
        </Grid>
        {/* <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push('/')}
          >
            Start a new quote
          </Button>
        </Grid> */}
      </Grid>
      <CustomizedDialog
        isOpen={Open}
        handleClose={handleClose}
        title={
          <Grid container spacing={3}>
            <Grid item>Quote Detail</Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSend()}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        }
        subtitle=""
        children={<QuoteDetail data={state} prices={prices} chosen={value} />}
      />
    </>
  );
}
