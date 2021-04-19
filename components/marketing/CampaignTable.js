import React, { useContext } from 'react';
import { getAllCamps } from '../../pages/api/getSpec';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CampForm from './CampForm';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Grid, IconButton } from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import firebase from '../../firebase/firebase';
import ConfirmDialog from '../shared/confirmDialog';
import { dispatchContext } from '../../pages/users/[id]/admin';

export default function CampaignTable() {
  const { dispatch } = useContext(dispatchContext);

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState({});

  const handleClose = () => {
    setOpen(false);
  };
  const handleRowSelected = (data) => {
    setOpen(true);
    setRowData(data);
  };

  const startNewCamp = () => {
    setRowData({});
    setOpen(true);
  };

  // handle add and update data
  const queryClient = useQueryClient();
  const mutateCampaign = async (data) => {
    const ref = firebase.firestore().collection('campaigns');
    const doc = await ref.doc(rowData.id).get();
    if (!doc.exists) {
      await ref
        .doc()
        .set(data)
        .then(() => handleClose())
        .catch((err) => console.error(err));
    } else {
      await ref
        .doc(rowData.id)
        .update(data)
        .then(() => handleClose())
        .catch((err) => console.error(err));
    }
  };

  const Mutation = useMutation(mutateCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries('camps');
    },
  });

  const handleOnSubmit = (data) => {
    console.log(data);
    Mutation.mutate(data);
  };
  //handle delete
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const deleteCampaign = async (id) => {
    const ref = firebase.firestore().collection('campaigns');
    await ref
      .doc(id)
      .delete()
      .then(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        });
      })
      .catch((err) => console.log(err.message));
  };
  const deleteMutation = useMutation(deleteCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries('camps');
    },
  });

  const onDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const { data, status } = useQuery('camps', getAllCamps);
  if (status === 'loading') return 'loading';
  if (status === 'error') return 'error';

  return (
    <>
      <Grid container justify="flex-start" spacing={3}>
        <Grid item xs={3}>
          <Tooltip title="start a new campaign" aria-label="add">
            <Fab color="primary" aria-label="add" onClick={startNewCamp}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            columns={[
              { field: 'name', title: 'Name' },
              { field: 'type', title: 'Type' },
              {
                field: 'startedDate',
                title: 'Start Date',
              },
              {
                field: 'expiredDate',
                title: 'Expired Date',
              },
              {
                field: 'description',
                title: 'Description',
              },
              {
                field: 'offer',
                title: 'Offer',
              },
              {
                field: 'id',
                title: 'Report',
                render: (rowData) => (
                  <IconButton
                    onClick={() =>
                      dispatch({ type: 'campReport', payload: rowData })
                    }
                  >
                    <TimelineIcon />
                  </IconButton>
                ),
              },
            ]}
            data={data}
            title="Campaign Table"
            actions={[
              {
                icon: 'delete',
                tooltip: 'Delete Log',
                onClick: (event, rowData) => {
                  setConfirmDialog({
                    isOpen: true,
                    title: 'Are you sure to delete this record?',
                    subTitle: "You can't undo this operation",
                    onConfirm: () => {
                      onDelete(rowData.id);
                    },
                  });
                },
              },
              {
                icon: 'edit',
                tooltip: 'Edit Log',
                onClick: (event, rowData) => {
                  handleRowSelected(rowData);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <CampForm
            rowData={rowData}
            handleClose={handleClose}
            defaultValues={rowData}
            handleOnSubmit={handleOnSubmit}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
