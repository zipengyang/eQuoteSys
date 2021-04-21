import React, { useContext } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { getAllSubmitted } from '../../../pages/api/getSpec';
import MaterialTable from 'material-table';
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import QuoteTemplate from '../../stepForms/QuoteTemplate';
import { IconButton } from '@material-ui/core';
import QuoteTemplatePortal from '../selfService/quoteTemplatePortal';
import { CustomizedDialog } from '../../shared/customizedDialog';
import QuoteTemplateAdmin from './QuoteTemplelateAdmin';

export default function SubmittedQuoteTable({ data }) {
  const [Open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState({});
  const handleClose = () => {
    setOpen(false);
  };
  data = data.filter((items) => items.status === 'submitted');
  const columns = [
    { field: 'id', title: 'ID' },
    { field: 'userId', title: 'Customer' },
    { field: 'ipAddress', title: 'IP' },
    { field: 'quantity', title: 'Qty' },
    {
      field: 'submittedDate',
      title: 'Date',
      type: 'date',
    },
    {
      field: 'leadtime',
      title: 'LeadTime',
    },
    {
      field: 'price',
      title: 'Price',
    },
    {
      field: 'progress',
      title: 'progress',
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
        <IconButton onClick={() => handlePrint(rowData)}>
          <AssignmentIcon />
        </IconButton>
      ),
    },
  ];
  const handlePrint = (data) => {
    setRowData(data);
    setOpen(true);
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
    </div>
  );
}
