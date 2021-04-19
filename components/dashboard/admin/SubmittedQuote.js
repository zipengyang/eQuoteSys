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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import QuoteTemplate from '../../stepForms/QuoteTemplate';
import { IconButton } from '@material-ui/core';
import QuoteTemplatePortal from '../selfService/quoteTemplatePortal';
import { CustomizedDialog } from '../../shared/customizedDialog';

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
      title: 'Print',
      render: (rowData) => (
        <IconButton onClick={() => handlePrint(rowData)}>
          <PrintIcon />
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
        title="Print Quote"
      >
        <QuoteTemplatePortal
          handleClose={handleClose}
          rowData={rowData}
          entrance="submitted"
        />
      </CustomizedDialog>
    </div>
  );
}
