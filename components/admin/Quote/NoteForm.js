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
import { useQueryClient } from 'react-query';

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

export default function ContactForm({ userId, quoteId, handleClose }) {
  const classes = useStyles();
  const [Open, setOpen] = React.useState(false);
  const { handleSubmit, register, errors, control } = useForm();
  const queryClient = useQueryClient();
  const onSubmit = async (data) => {
    const ref = firebase.firestore().collection('timelineLog');
    await ref
      .doc()
      .set({
        userId: userId,
        quoteId: quoteId,
        type: data.type,
        title: data.title,
        content: data.content,
        date: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => queryClient.invalidateQueries('timelineLog'))
      .then(() => handleClose())
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Container component="main">
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl variant="outlined">
                <InputLabel id="select-helper-label">Type</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="call">Phone Call</MenuItem>
                      <MenuItem value="meeting">Meeting</MenuItem>
                      <MenuItem value="note">Note</MenuItem>
                    </Select>
                  )}
                  name="type"
                  defaultValue="call"
                  control={control}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                autoComplete="title"
                variant="outlined"
                required
                fullWidth
                label="Titel"
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

            {/* <Grid item xs={12}>
              <MUIRichTextEditor
                label="Reference"
                // defaultValue={content}
                onSave={onSubmit}
                toolbar={true}
              />
            </Grid> */}

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
