import React from 'react';
import { getAllCamps } from '../../pages/api/getSpec';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import { useQuery } from 'react-query';
import ConfirmDialog from '../shared/confirmDialog';

export default function CampSelection({ handleCampSelected }) {
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const { data, status } = useQuery('camps', getAllCamps);
  if (status === 'loading') return 'loading';
  if (status === 'error') return 'error';

  return (
    <>
      <div style={{ height: 680, width: '100%' }}>
        <Grid container justify="flex-end">
          <Grid item xs={12}>
            <MaterialTable
              title="Campaign Selection"
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
              ]}
              data={data}
              actions={[
                {
                  icon: 'forward',
                  tooltip: 'pick me',

                  onClick: (event, rowData) => {
                    setConfirmDialog({
                      isOpen: true,
                      title:
                        'Are you sure to add selected quotes to this campaign?',
                      subTitle:
                        "Emails will be sent to customers,You can't undo this operation",
                      onConfirm: () => {
                        handleCampSelected(rowData);
                      },
                    });
                  },
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
