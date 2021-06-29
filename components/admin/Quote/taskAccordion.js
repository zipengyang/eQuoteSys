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
import TaskForm from './taskForm';

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

export default function TaskAccordion({ userId, quoteId }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [Open, setOpen] = React.useState(false);
  const [refOpen, setRefOpen] = React.useState(false);
  const [noteId, setNoteId] = React.useState(false);

  const queryClient = useQueryClient();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAdd = () => {
    setOpen(!Open);
  };

  const { data, isLoading, isError } = useQuery(
    ['timelineLog', quoteId],
    getTimelineLogByQuoteId,
  );
  if (isLoading) return '...loading';
  if (isError) return '...error';

  const tasks = data.filter((item) => item.type === 'task');

  return (
    <>
      <div className={classes.root}>
        <Fab color="primary" aria-label="add" onClick={() => handleAdd()}>
          <AddIcon />
        </Fab>
        {tasks &&
          tasks.map((task) => (
            <Accordion
              key={task.id}
              expanded={expanded === task.id}
              onChange={handleChange(task.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography className={classes.heading}>
                      Subject: {task.title}
                    </Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <Typography className={classes.secondaryHeading}>
                      {moment(task.date.toDate()).format('DD/MM/yy')}{' '}
                      {moment(task.date.toDate()).format('hh:mm A')}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container justify="flex-start">
                  <Grid item xs={12}>
                    <Typography>{task.content}</Typography>
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
          <TaskForm userId={userId} quoteId={quoteId} handleClose={handleAdd} />
        </DialogContent>
      </Dialog>
    </>
  );
}
