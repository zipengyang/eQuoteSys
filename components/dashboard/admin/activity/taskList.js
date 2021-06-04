import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useQuery } from 'react-query';
import moment from 'moment';
import TaskForm from './taskForm';
import { TreeItem } from '@material-ui/lab';
import TaskFormDisplay from './taskFormDisplay';
import { getTasks } from '../../../../pages/api/getSpec';
import TaskHeader from './taskHeader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Avatar, Chip, Grid, Switch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function TaskList({ customer, handleOnSubmit, admins }) {
  const classes = useStyles();
  // switch
  const [state, setState] = React.useState({
    checkedA: false,
    showInCompletionOnly: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { data, isLoading, isError } = useQuery(
    ['tasks', customer.id],
    getTasks,
  );
  if (isLoading) return 'loading...';
  if (isError) return 'error...';

  const tasks = state.showInCompletionOnly
    ? data.filter((item) => item.isCompleted === false)
    : data;

  return (
    <div>
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={state.showInCompletionOnly}
              onChange={handleChange}
              name="showInCompletionOnly"
              color="primary"
            />
          }
          label="Show Incompletion only"
        />
      </div>
      {tasks.map((item) => (
        <Accordion key={item.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <TaskHeader
              task={item.name}
              assignedTo={item.assignedTo}
              due={item.dueDate}
              isCompleted={item.isCompleted}
            />
          </AccordionSummary>
          <AccordionDetails>
            <TaskFormDisplay
              defaultValues={item}
              handleOnSubmit={handleOnSubmit}
              admins={admins}
            />
          </AccordionDetails>
          <AccordionDetails>
            <Grid container spacing={2} justify="space-around">
              <Chip
                avatar={<Avatar></Avatar>}
                label={item.createdBy}
                color="primary"
                // deleteIcon={<DoneIcon />}
                variant="outlined"
              />
              <Chip
                avatar={<Avatar>Date</Avatar>}
                label={item.createdDate}
                color="primary"
                // deleteIcon={<DoneIcon />}
                variant="outlined"
              />
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
