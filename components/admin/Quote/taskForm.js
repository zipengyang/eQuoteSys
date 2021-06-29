import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm, Controller } from 'react-hook-form';
import MUIRichTextEditor from 'mui-rte';
import firebase from '../../../firebase/firebase';
import { useQuery, useQueryClient } from 'react-query';
import { getAdmins } from '../../../pages/api/getSpec';

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

export default function TaskForm({ userId, quoteId, handleClose }) {
  const classes = useStyles();
  const [Open, setOpen] = React.useState(false);
  const { handleSubmit, register, errors, control } = useForm();
  const queryClient = useQueryClient();
  const onSubmit = async (data) => {
    console.log(data);
    const ref = firebase.firestore().collection('timelineLog');
    await ref
      .doc()
      .set({
        userId: userId,
        quoteId: quoteId,
        type: 'task',
        priority: data.priority,
        assignedTo: data.assignedTo,
        title: data.title,
        content: data.content,
        date: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => queryClient.invalidateQueries('timelineLog'))
      .then(() => handleClose())
      .catch((err) => console.error(err));
  };

  // get users for assignedTo
  const { data: admins, isLoading, isError } = useQuery('admins', getAdmins);

  if (isLoading) return '...Loading';
  if (isError) return '...Error';

  return (
    <>
      <Container component="main">
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="title"
                variant="outlined"
                required
                fullWidth
                label="title"
                autoFocus
                {...register('title')}
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
                label="Content"
                {...register('content')}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined">
                <InputLabel id="select-priority-label">Priority</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  )}
                  name="priority"
                  defaultValue="normal"
                  control={control}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="assignedTo">Assigned To</InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select {...field}>
                      {admins &&
                        admins.map((admin) => (
                          <MenuItem value={admin.id}>
                            {admin.displayName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="assignedTo"
                  defaultValue="crm@exceptionpcb.com"
                  control={control}
                />
              </FormControl>
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
      </Container>
    </>
  );
}
