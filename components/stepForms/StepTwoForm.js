import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Paper } from '@material-ui/core';
import { useStyle } from '../../src/styles';
import { Grid, Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

export default function StepTwoForm({ defaultValues, handleOnSubmit }) {
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
      router.push(`/quote/${quoteid}/${uid}/0?tabValue=0`);
    }
    if (url === 'next') {
      router.push(`/quote/${quoteid}/${uid}/0?tabValue=2`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="material">Material</InputLabel>
              <Select native name="material" inputRef={register}>
                <option value="fr4">FR-4</option>
                <option value="rogers">Rogers</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="classification">Classification</InputLabel>
              <Select native name="classification" inputRef={register}>
                <option value="A">A</option>
                <option value="AA">AA</option>
                <option value="AAA">AAA</option>
                <option value="AAA+">AAA+</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="weight">Weight</InputLabel>
              <Select native name="weight" inputRef={register}>
                <option value="0.7">0.7</option>
                <option value="0.9">0.9</option>
                <option value="1.0">1.0</option>
                <option value="1.1">1.1</option>
                <option value="1.2">1.2</option>
              </Select>
            </FormControl>
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
