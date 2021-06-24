import React from 'react';
import MaterialTable from 'material-table';
import { useQueryClient } from 'react-query';
import firebase from '../../firebase/firebase';
import ConfirmDialog from '../shared/confirmDialog';
import CampSelection from './CampSelection';
import { CustomizedDialog } from '../shared/customizedDialog';
import FilterListIcon from '@material-ui/icons/FilterList';
import { IconButton } from '@material-ui/core';
// import FilterPanel from '../../shared/filterPanel';
import moment from 'moment';

export default function QuotesForCampaign({ data }) {
  data = data.filter((items) => items.status === 'quoted' && !items.campaigns);

  //   const handleFilter = (data) => {
  //     // console.log(data);
  //   };

  const [Open, setOpen] = React.useState(false);
  const [isFilterOpen, setFilterOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };

  //   const handleFilterClose = () => {
  //     setFilterOpen(false);
  //   };

  // handle add and update data
  const handleUpdateCamp = async (data) => {
    setOpen(true);
    setSelected(data);
  };

  // handle update via cloud functions

  const handleCampSelected = (camp) => {
    //update campId only for data reflash. cloud funcitons handle the rest.
    const ref = firebase.firestore().collection('specs');
    let newArr = [];
    selected &&
      selected.map((item) => {
        newArr.push({ id: item.id, userId: item.userId });
        ref
          .doc(item.id)
          .update({
            campaigns: {
              campaignId: camp.id,
            },
          })
          .then(() => {
            queryClient.invalidateQueries('specs');
            setOpen(false); //close form
            setSelected([]); // reset selection
          })
          .catch((error) => console.error(error));
      });
    // create a new array with reducing properties
    const data = {
      camp: {
        id: camp.id,
        type: camp.type,
        offer: camp.offer,
        expiredDate: camp.expiredDate,
        startedDate: camp.startedDate,
      },
      specs: newArr,
    };
    // pass all selected data and pass to functions to loop over rather than calling funcions many times?

    // call cloud functions
    const updateAndSendOfferEmail = firebase
      .functions()
      .httpsCallable('updateAndSendOfferEmail');
    updateAndSendOfferEmail(data)
      .then(() => {
        console.log('email sent');
      })
      .catch((err) => console.log(err));
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
          // { field: 'weight', title: 'Weight' },
          // {
          //   field: 'classification',

          //   title: 'Classification',
          // },
          {
            field: 'createdDate',
            title: 'Date',
            render: (rowData) =>
              moment(rowData.createdDate.toDate()).format('DD/MM/yy'),
          },
          { field: 'id', title: 'Id' },
          { field: 'quantity', title: 'Qty' },
          // {
          //   field: 'price',
          //   title: 'Price',
          // },
          // {
          //   field: 'campaigns.campaignId',
          //   title: 'Offered',
          //   render: (row) => <div>{!row.campaigns ? 'no' : 'yes'}</div>,
          // },
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

      {/* <CustomizedDialog
        isOpen={isFilterOpen}
        handleClose={handleFilterClose}
        title=""
      >
        <FilterPanel handleFilter={handleFilter} />
      </CustomizedDialog> */}

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
