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
import firebase from '../../../firebase/firebase';
import { useMutation, useQueryClient } from 'react-query';

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

export default function UpdateCustomerInfo({ rowData, handleClose }) {
  console.log(rowData.id);
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { handleSubmit, register, reset, control, errors } = useForm({
    defaultValues: rowData,
  });
  const updateCustomer = async (data) => {
    // console.log(data);
    const ref = firebase.firestore().collection('users');

    await ref
      .doc(rowData.id)
      .update({
        PCPRef: data.PCPRef,
        sector: data.sector,
        weight: data.weight,
        isBlocked: data.isBlocked,
      })
      .then(() => {
        handleClose(); //close dialog
      })
      .catch((err) => console.log(err));
  };

  const Mutation = useMutation(updateCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
  const onSubmit = (data) => {
    Mutation.mutate(data);
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
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="PCPRef"
              name="PCPRef"
              variant="outlined"
              required
              fullWidth
              id="PCPRef"
              label="PCP Reference"
              autoFocus
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="sector"
              label="Industrial Sector"
              name="sector"
              autoComplete="sector"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="weight"
              label="Weight"
              name="weight"
              autoComplete="weight"
              inputRef={register}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel htmlFor="isBlocked">Is blocked?</InputLabel>
            {/* <label>Field 1:</label> */}
            <Switch
              name="isBlocked"
              defaultChecked={false}
              inputRef={register}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              // type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
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
        </Grid>
      </form>
    </Container>
  );
}
