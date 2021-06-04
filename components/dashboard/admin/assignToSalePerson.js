import React from 'react';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import { useQuery } from 'react-query';
import { getAdmins } from '../../../pages/api/getSpec';

export default function AssigneToSalePerson({ handleAssignedTo, handleClose }) {
  // get users for assignedTo
  const { data, isLoading, isError } = useQuery('admins', getAdmins);
  if (isLoading) return 'loading';
  if (isError) return 'error';

  return (
    <>
      <div style={{ height: 680, width: '100%' }}>
        <Grid container justify="flex-end">
          <Grid item xs={12}>
            <MaterialTable
              //   title="Assign to"
              columns={[
                { field: 'displayName', title: 'Name' },
                { field: 'id', title: 'Email' },
              ]}
              data={data}
              actions={[
                {
                  icon: 'forward',
                  tooltip: 'pick a person',

                  onClick: (event, rowData) => {
                    handleAssignedTo(rowData);
                  },
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
