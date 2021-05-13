import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAdmins } from '../../../../pages/api/getSpec';
import { CustomizedDialog } from '../../../shared/customizedDialog';
import TaskForm from './taskForm';
import TaskList from './taskList';
import firebase from '../../../../firebase/firebase';
import { useAuth } from '../../../../firebase/auth';
import moment from 'moment';

export default function TaskTab({ customer }) {
  const { user } = useAuth();

  const [Open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  // save or update task
  const mutateTask = async (data) => {
    // call cloud function instead
    const ref = firebase.firestore().collection('tasks');
    const doc = await ref.doc(data.id).get();
    if (!doc.exists) {
      data.createdBy = user ? user.email : '';
      data.createdDate = moment(
        firebase.firestore.FieldValue.serverTimestamp(),
      ).format('DD/MM/YYYY');
      data.customerId = customer.id;
      data.isCompleted = false;
      await ref
        .doc()
        .set(data)
        .then(() => handleClose())
        .catch((err) => console.error(err));
    } else {
      await ref
        .doc(data.id)
        .update(data)
        .then(() => handleClose())
        .catch((err) => console.error(err));
    }
  };
  const queryClient = useQueryClient();
  const Mutation = useMutation(mutateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });
  const handleOnSubmit = (data) => {
    Mutation.mutate(data);
  };

  // get users for assignedTo
  const { data, isLoading, isError } = useQuery('admins', getAdmins);

  if (isLoading) return '...Loading';
  if (isError) return '...Error';

  return (
    <>
      <div>
        <Grid container spacing={3} justify="flex-end">
          <Grid item>
            <TaskList
              customer={customer}
              handleOnSubmit={handleOnSubmit}
              admins={data}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              create task
            </Button>
          </Grid>
        </Grid>
      </div>
      <div>
        <CustomizedDialog
          isOpen={Open}
          handleClose={handleClose}
          title="New Task"
        >
          <TaskForm admins={data} handleOnSubmit={handleOnSubmit} />
        </CustomizedDialog>
      </div>
    </>
  );
}
