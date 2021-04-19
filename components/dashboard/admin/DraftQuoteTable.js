import React from 'react';
import MaterialTable from 'material-table';
import { useQueryClient } from 'react-query';
import firebase from '../../../firebase/firebase';
import ConfirmDialog from '../../shared/confirmDialog';
import CampSelection from '../../marketing/CampSelection';
import { CustomizedDialog } from '../../shared/customizedDialog';
import FilterListIcon from '@material-ui/icons/FilterList';
import { IconButton } from '@material-ui/core';
import FilterPanel from '../../shared/filterPanel';

export default function DraftQuoteTable({ data }) {
  data = data.filter((items) => items.status === 'draft' && !items.campaigns);

  const handleFilter = (data) => {
    // console.log(data);
  };

  const [Open, setOpen] = React.useState(false);
  const [isFilterOpen, setFilterOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  // handle add and update data
  const handleUpdateCamp = async (data) => {
    setOpen(true);
    setSelected(data);
  };

  const handleCampSelected = (camp) => {
    const ref = firebase.firestore().collection('specs');
    selected &&
      selected.map((item) => {
        ref
          .doc(item.id)
          .update({
            campaigns: {
              campaignId: camp.id,
              isClicked: false,
              isAccepted: false,
              offerDate: camp.startedDate,
              type: camp.type,
              offer: camp.offer,
              expiredDate: camp.expiredDate,
            },
          })
          .then(() => {
            queryClient.invalidateQueries('specs');
            setOpen(false); //close form
            setSelected([]); // reset selection
          })
          .catch((err) => console.log(err));
      });
  };

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  return (
    <>
      <MaterialTable
        columns={[
          { field: 'userId', title: 'Contact' },
          {
            field: 'ipAddress',

            title: 'IP',
          },
          { field: 'weight', title: 'Weight' },
          {
            field: 'classification',

            title: 'Classification',
          },
          {
            field: 'createdDate',

            title: 'Date',
          },
          { field: 'leadtime', title: 'LeadTime' },
          { field: 'quantity', title: 'Qty' },
          {
            field: 'price',
            title: 'Price',
          },
          {
            field: 'campaigns.campaignId',
            title: 'Offered',
            render: (row) => <div>{!row.campaigns ? 'no' : 'yes'}</div>,
          },
        ]}
        data={data}
        title={
          <IconButton onClick={() => setFilterOpen(true)}>
            <FilterListIcon />
          </IconButton>
        }
        options={{
          selection: true,
          filtering: false,
        }}
        actions={[
          {
            tooltip: 'add to campaign',
            icon: 'assessment',
            onClick: (evt, data) => {
              handleUpdateCamp(data);
            },
          },
        ]}
      />

      <CustomizedDialog
        isOpen={isFilterOpen}
        handleClose={handleFilterClose}
        title=""
      >
        <FilterPanel handleFilter={handleFilter} />
      </CustomizedDialog>

      <CustomizedDialog isOpen={Open} handleClose={handleClose} title="">
        <CampSelection handleCampSelected={handleCampSelected} />
      </CustomizedDialog>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
