import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Checkbox, Switch } from '@material-ui/core';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';

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

export default function FilterForm({ handleOnSubmit }) {
  const classes = useStyles();
  const { handleSubmit, register, reset, control, errors } = useForm({
    defaultValues: { minWeight: 0, maxWeight: 2, isExcludeOffered: false },
  });
  const onSubmit = (data) => {
    handleOnSubmit(data);
  };

  // switch
  // const [state, setState] = React.useState({
  //   checkedA: true,
  //   checkedB: true,
  // });

  // const handleChange = (event) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };

  return (
    <Container component="main" maxWidth="sm">
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="minWeight"
              name="minWeight"
              variant="outlined"
              required
              fullWidth
              id="minWeight"
              label="minWeight"
              autoFocus
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="maxWeight"
              label="maxWeight"
              name="maxWeight"
              autoComplete="maxWeight"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              control={control}
              as={TextField}
              id="fromDate"
              label="From"
              type="date"
              name="fromDate"
              fullWidth
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            ></Controller>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              control={control}
              as={TextField}
              id="toDate"
              label="To"
              type="date"
              name="toDate"
              fullWidth
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            ></Controller>
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel htmlFor="isExcludeOffered">Exclude Offered</InputLabel>
            {/* <label>Field 1:</label> */}
            <Switch
              name="isExcludeOffered"
              defaultChecked
              inputRef={register}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
              onClick={() => {
                reset({ minWeight: 0.0, maxWeight: 2.0 });
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
