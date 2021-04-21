import React, { useContext } from 'react';
import MaterialTable from 'material-table';
import PrintIcon from '@material-ui/icons/Print';
import GetAppIcon from '@material-ui/icons/GetApp';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import {
  getCustomerDraftSpecs,
  getCustomerSubmitted,
} from '../../../pages/api/getSpec';
import { useQuery, useQueryClient } from 'react-query';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { QuoteTemplate } from '../../stepForms';
import QuoteDetailForPortal from '../QuoteDetailForPortal';
import QuoteTemplatePortal from './quoteTemplatePortal';
import firebase from '../../../firebase/firebase';
import { Badge, IconButton } from '@material-ui/core';
import { CustomizedDialog } from '../../shared/customizedDialog';
import { dispatchContext } from '../../../pages/users/[id]/selfService';

export default function SubmittedQuoteTable() {
  const { data } = useContext(dispatchContext);
  const columns = [
    {
      id: 'id',
      label: 'QuoteId',
    },
    { field: 'userId', title: 'Contact' },

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
      field: 'progress',
      title: 'progress',
    },
    {
      field: 'id',
      title: 'Action',
      render: (rowData) => (
        <IconButton onClick={() => handlePrint(rowData)}>
          <PrintIcon />
        </IconButton>
      ),
    },
  ];

  const [Open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState({});
  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = (rowData) => {
    setRowData(rowData);
    setOpen(true);
  };

  return (
    <div style={{ height: 680, width: 1080 }}>
      <MaterialTable
        data={data}
        columns={columns}
        title="Submitted Quotes"
        options={{
          selection: false,
          filtering: false,
        }}
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
