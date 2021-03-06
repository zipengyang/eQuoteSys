import React, { useContext } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import Link from 'next/link';
import { useQuery, useQueryClient } from 'react-query';
import { getAllSubmitted } from '../../pages/api/getSpec';
import MaterialTable from 'material-table';
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import QuoteTemplate from '../stepForms/QuoteTemplate';
import { IconButton, Typography } from '@material-ui/core';
import QuoteTemplatePortal from '../dashboard/selfService/quoteTemplatePortal';
import { CustomizedDialog } from '../shared/customizedDialog';
import QuoteTemplateAdmin from '../dashboard/admin/QuoteTemplelateAdmin';
import SearchIcon from '@material-ui/icons/Search';
import AssigneToSalePerson from '../dashboard/admin/assignToSalePerson';
import firebase from '../../firebase/firebase';
import moment from 'moment';
import { useRouter } from 'next/router';
import { dispatchContext } from '../../pages/users/[id]/admin';

export default function SubmittedQuoteTable({ data }) {
  const [Open, setOpen] = React.useState(false);
  const [OpenPerson, setOpenPerson] = React.useState(false);
  const [specId, setSpecId] = React.useState();
  const [rowData, setRowData] = React.useState({});
  const queryClient = useQueryClient();
  // const router = useRouter();
  // const uid = router.query.id;
  const { dispatch } = useContext(dispatchContext);
  const handleClick = (data) => {
    setRowData(data);
    dispatch({ type: 'quoteAllInOneView', payload: data });
    // setOpen(true);
    // const quoteId = data.id;
    // router.push(`/users/${uid}/${quoteId}/`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  data = data.filter((items) => items.status === 'submitted');
  const columns = [
    {
      field: 'id',
      title: 'ID',
      render: (rowData) => rowData.id.substring(0, 6),
    },
    { field: 'userId', title: 'Customer' },
    { field: 'ipAddress', title: 'IP' },
    { field: 'quantity', title: 'Qty' },
    {
      field: 'createdDate',
      title: 'Date',
      // type: 'date',
      render: (rowData) =>
        moment(rowData.createdDate.toDate()).format('DD/MM/YY'),
    },
    // {
    //   field: 'leadtime',
    //   title: 'LeadTime',
    // },
    // {
    //   field: 'price',
    //   title: 'Price',
    // },
    // {
    //   field: 'progress',
    //   title: 'progress',
    // },
    {
      field: 'assignedTo',
      title: 'Assign to',
      render: (row) => (
        <IconButton onClick={() => handleOpenPerson(row.id)} size="small">
          {row.assignedTo ? (
            <Typography variant="body2">{row.assignedTo}</Typography>
          ) : (
            <SearchIcon />
          )}
        </IconButton>
      ),
    },
    {
      field: 'gerberFileUrl',
      title: 'GerBer File',
      render: (rowData) => (
        <a target="_blank" href={rowData.gerberFileUrl}>
          <GetAppIcon />
        </a>
      ),
    },
    {
      field: 'id',
      title: 'Action',
      render: (rowData) => (
        <IconButton onClick={() => handleClick(rowData)}>
          <AssignmentIcon />
        </IconButton>
      ),
    },
  ];

  const handleOpenPerson = (id) => {
    setSpecId(id);
    setOpenPerson(true);
  };
  const handleAssignedTo = async (data) => {
    const email = data.id;
    // update spec
    const ref = firebase.firestore().collection('specs');
    await ref
      .doc(specId)
      .update({
        assignedTo: email,
      })
      .then(() => queryClient.invalidateQueries('specs'), setOpenPerson(false))
      .catch((err) => console.err(err));
  };

  return (
    <div style={{ height: 580, width: '100%' }}>
      <MaterialTable
        data={data}
        title="Submitted Quotes"
        columns={columns}
        options={{ filtering: true, exportButton: true }}
      />

      <CustomizedDialog
        isOpen={Open}
        handleClose={handleClose}
        title="Confirm Quote"
      >
        <QuoteTemplateAdmin
          handleClose={handleClose}
          rowData={rowData}
          entrance="submitted"
        />
      </CustomizedDialog>
      {/* select sales person */}
      <CustomizedDialog
        isOpen={OpenPerson}
        handleClose={handleClose}
        title="Assign to"
      >
        <AssigneToSalePerson
          handleClose={handleClose}
          handleAssignedTo={handleAssignedTo}
        />
      </CustomizedDialog>
    </div>
  );
}
