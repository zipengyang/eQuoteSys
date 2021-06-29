import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
import {
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  DialogContent,
  Dialog,
  DialogTitle,
} from '@material-ui/core';
import firebase from '../../../firebase/firebase';
import CloseIcon from '@material-ui/icons/Close';
import { useQuery, useQueryClient } from 'react-query';
import { getTimelineLogByQuoteId } from '../../../pages/api/getSpec';
import NoteForm from './NoteForm';
import MUIRichTextEditor from 'mui-rte';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 'bold',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),

    color: theme.palette.text.secondary,
  },
}));

export default function NoteAccordion({ userId, quoteId }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [Open, setOpen] = React.useState(false);
  const [refOpen, setRefOpen] = React.useState(false);
  const [noteId, setNoteId] = React.useState(false);

  const queryClient = useQueryClient();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRef = (id) => {
    setNoteId(id);
    setRefOpen(!refOpen);
    console.log(noteId);
  };
  const save = async (data) => {
    // convert data to string before save to firebase
    const stringfiedData = JSON.stringify(data);

    const ref = firebase.firestore().collection('timelineLog');
    await ref
      .doc(noteId)
      .update({ reference: stringfiedData })
      .then(() => {
        setRefOpen(!refOpen);
        queryClient.invalidateQueries('timelineLog');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAdd = () => {
    setOpen(!Open);
  };

  //   const handleChangeFiling = async (email) => {
  //     const updatedQuoteId = email.quoteId === '' ? quoteId : '';
  //     const ref = firebase.firestore().collection('timelineLog');

  //     await ref
  //       .doc(email.id)
  //       .update({ quoteId: updatedQuoteId })
  //       .then(() => {
  //         queryClient.invalidateQueries('timelineLog');
  //       })
  //       .catch((err) => console.error(err));
  //   };
  const type = 'note';
  const { data, isLoading, isError } = useQuery(
    ['timelineLog', quoteId],
    getTimelineLogByQuoteId,
  );
  if (isLoading) return '...loading';
  if (isError) return '...error';

  const notes = data.filter(
    (item) =>
      item.type === 'call' || item.type === 'meeting' || item.type === 'note',
  );
  // const noteRef = value ? JSON.parse(value) : null;
  return (
    <>
      <div className={classes.root}>
        <Fab color="primary" aria-label="add" onClick={() => handleAdd()}>
          <AddIcon />
        </Fab>
        {notes &&
          notes.map((note) => (
            <Accordion
              key={note.id}
              expanded={expanded === note.id}
              onChange={handleChange(note.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography className={classes.heading}>
                      Subject: {note.title}
                    </Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <Typography className={classes.secondaryHeading}>
                      {moment(note.date.toDate()).format('DD/MM/yy')}{' '}
                      {moment(note.date.toDate()).format('hh:mm A')}
                    </Typography>
                    <button onClick={() => handleRef(note.id)}>
                      Add a Reference
                    </button>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container justify="flex-start">
                  <Grid item xs={12}>
                    <Typography>{note.content}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {note.reference !== undefined && (
                      <Typography>
                        Reference:
                        <MUIRichTextEditor
                          defaultValue={JSON.parse(note.reference)}
                          toolbar={false}
                        />
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>

      <Dialog
        open={Open}
        fullWidth
        maxWidth="sm"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between">
            <Grid item>
              <IconButton onClick={() => setOpen(!Open)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <NoteForm userId={userId} quoteId={quoteId} handleClose={handleAdd} />
        </DialogContent>
      </Dialog>
      {/* reference content  */}
      <Dialog
        open={refOpen}
        fullWidth
        maxWidth="sm"
        // style={{ height: '800px' }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between">
            <Grid item>
              <IconButton onClick={() => setRefOpen(!refOpen)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <MUIRichTextEditor
            label="Reference"
            // defaultValue={content}
            onSave={save}
            // inlineToolbar={true}
            toolbar={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
