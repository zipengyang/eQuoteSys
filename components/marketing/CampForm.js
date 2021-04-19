import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
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

export default function CampForm({
  handleOnSubmit,
  handleClose,
  defaultValues,
}) {
  const classes = useStyles();
  const { handleSubmit, register, errors, control } = useForm({
    defaultValues,
  });
  const onSubmit = (data) => {
    handleOnSubmit(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="name"
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Camp Name"
              autoFocus
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            {/* <TextField
              variant="outlined"
              required
              fullWidth
              id="type"
              label="Camp Type"
              name="type"
              autoComplete="type"
              inputRef={register}
            /> */}

            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="type">Camp Type</InputLabel>
              <Select native name="type" inputRef={register}>
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">% Discount</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="offer"
              label="Offer"
              name="offer"
              autoComplete="offer"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select native name="status" inputRef={register}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              as={TextField}
              id="startedDate"
              label="Start Date"
              type="date"
              name="startedDate"
              fullWidth
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            ></Controller>
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              as={TextField}
              id="expiredDate"
              label="Expired Date"
              type="date"
              name="expiredDate"
              fullWidth
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            ></Controller>
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              rows={3}
              rowsMax={8}
              name="description"
              label="Description"
              id="description"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              // color="primary"
              className={classes.submit}
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
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
