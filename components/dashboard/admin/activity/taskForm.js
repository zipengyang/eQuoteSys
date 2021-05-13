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

export default function TaskForm({
  handleOnSubmit,
  //   handleClose,
  //   defaultValues,
  admins,
}) {
  const classes = useStyles();
  const { handleSubmit, register, errors, control } = useForm();
  const onSubmit = (data) => {
    handleOnSubmit(data);
    // console.log(data);
  };

  return (
    <Container component="main" maxWidth="md">
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <TextField
              autoComplete="name"
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Enter your task's name"
              autoFocus
              inputRef={register}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              as={TextField}
              id="dueDate"
              label="Due Date"
              type="date"
              name="dueDate"
              fullWidth
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            ></Controller>
          </Grid>

          <Grid item xs={2}>
            <Controller
              control={control}
              as={TextField}
              id="time"
              label="Time"
              type="time"
              name="time"
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
              name="notes"
              label="Notes"
              id="note"
              inputRef={register}
            />
          </Grid>

          <Grid item xs={4} sm={4}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select native name="type" inputRef={register}>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="todo">To-do</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="priority">Priority</InputLabel>
              <Select native name="priority" inputRef={register}>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="none">None</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="assignedTo">Assigned To</InputLabel>
              <Select native name="assignedTo" inputRef={register}>
                {admins.map((admin) => (
                  <option value={admin.id}>{admin.displayName}</option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="reminder">Reminder</InputLabel>
              <Select native name="reminder" inputRef={register}>
                <option value="none">No Reminder</option>
                <option value="0">At task due time</option>
                <option value="30">30 minutes before</option>
                <option value="60">one hour before</option>
                <option value="custom">custom</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox />}
              label="Asyn to Outlook"
              name="outlook"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
