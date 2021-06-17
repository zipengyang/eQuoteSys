import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/router';

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

export default function ContactForm({ handleOnSubmit }) {
  //   const router = useRouter();
  //   const { quoteid, uid, step } = router.query;
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (data) => {
    handleOnSubmit(data);
  };

  return (
    <Container component="main">
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              variant="outlined"
              required
              fullWidth
              label="First Name"
              autoFocus
              {...register('firstName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Last Name"
              autoComplete="lname"
              {...register('lastName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Company Name"
              autoComplete="cName"
              {...register('companyName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              {...register('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              rows={3}
              rowsMax={8}
              label="Note"
              {...register('note')}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="gerberFile">Your Gerber file</InputLabel>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="gerberFile"
              type="file"
              {...register('gerberFile')}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* <Grid container justify="center">
        <Grid item>
          <Link href={`/quote/${quoteid}/uid/${step}/login`}>
            <a>Already customer? Login</a>
          </Link>
        </Grid>
      </Grid> */}
    </Container>
  );
}
