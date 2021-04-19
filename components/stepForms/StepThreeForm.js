import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Paper } from '@material-ui/core';
import { useStyle } from '../../src/styles';
import { Grid, Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

export default function StepThreeForm({ defaultValues, handleOnSubmit }) {
  const classes = useStyle();
  const router = useRouter();
  const { quoteid, uid, step } = router.query;
  const { handleSubmit, register, errors } = useForm({
    defaultValues,
  });
  const [url, setUrl] = React.useState('');
  const onSubmit = (data) => {
    handleOnSubmit(data);
    if (url === 'back') {
      router.push(`/quote/${quoteid}/${uid}/0?tabValue=1`);
    }
    if (url === 'next') {
      router.push(`/quote/${quoteid}/${uid}/1`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="leadtime">LeadTime</InputLabel>
              <Select native name="leadtime" inputRef={register}>
                <option value="5">5 Days</option>
                <option value="10">10 Days</option>
                <option value="20">20 Days</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              required
              id="price"
              name="price"
              label="Price"
              fullWidth
              autoComplete="price"
              inputRef={register}
            />
          </Grid>
        </Grid>

        <Grid container justify="space-between">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              onClick={() => setUrl('back')} // can't not push url here, form won't submit
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              onClick={() => setUrl('next')}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
