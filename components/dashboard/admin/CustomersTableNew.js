import React, { useContext } from 'react';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import UpdateCustomerInfo from './UpdateCustomerInfo';
import { getAllUsers } from '../../../pages/api/getSpec';
import { useQuery } from 'react-query';
import { dispatchContext } from '../../../pages/users/[id]/admin';
import { Grid, IconButton } from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';

export default function CustomerTable({ data }) {
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
  // const { data, status } = useQuery('users', getAllUsers);
  // if (status === 'loading') return 'loading';
  // if (status === 'error') return 'error';

  return (
    <>
      <div style={{ height: 580, width: '100%' }}>
        <MaterialTable
          columns={[
            { field: 'id', title: 'Email' },
            { field: 'companyName', title: 'Customer' },
            { field: 'firstName', title: 'Contact' },
            // {
            //   field: 'createdDate',
            //   title: 'Create Date',
            // },
            {
              field: 'sector',
              title: 'Sector',
            },
            {
              field: 'PCPRef',
              title: 'PCP Reference',
            },
            {
              field: 'weight',
              title: 'Weight',
            },
            {
              field: 'id',
              title: 'Activity',
              render: (rowData) => (
                <IconButton
                  onClick={() =>
                    dispatch({ type: 'customerTimeLine', payload: rowData })
                  }
                >
                  <TimelineIcon />
                </IconButton>
              ),
            },
          ]}
          data={data}
          title="Customer Management"
          options={{
            exportButton: true,
            filtering: false,
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Log',
              onClick: (event, rowData) => {
                handleRowSelected(rowData);
                // console.log(rowData.id);
              },
            },
          ]}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <UpdateCustomerInfo rowData={rowData} handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}
