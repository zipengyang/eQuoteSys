import React from 'react';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Grid, Button, InputLabel, Container } from '@material-ui/core';
import { useQuery } from 'react-query';
import { getAllCamps } from '../../pages/api/getSpec';

import { Controller, useForm } from 'react-hook-form';
import { useStyle } from '../../src/styles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function CampaignSelector({ handleCampSubmit }) {
  const classes = useStyles();

  const { handleSubmit, register } = useForm();
  const onSubmit = (data) => {
    handleCampSubmit(data);
  };
  //fetch campaigns
  const { data, status } = useQuery('camps', getAllCamps);
  if (status === 'loading') return 'loading';
  if (status === 'error') return 'error';

  return (
    <>
      <Container component="main" maxWidth="sm">
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="name">Campaign</InputLabel>
                <Select native name="name" inputRef={register}>
                  {data.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.startedDate}--{item.name}--{item.offer}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
