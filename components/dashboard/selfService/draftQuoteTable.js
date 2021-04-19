import React, { useContext } from 'react';
import MaterialTable from 'material-table';
import PrintIcon from '@material-ui/icons/Print';
import GetAppIcon from '@material-ui/icons/GetApp';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { getCustomerDraftSpecs } from '../../../pages/api/getSpec';
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

export default function DraftQuoteTable() {
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
      field: 'id',
      title: 'Action',
      render: (rowData) => (
        <Badge
          badgeContent={rowData.campaigns ? 'offer available' : null}
          color="secondary"
        >
          <IconButton onClick={() => handlePrint(rowData)}>
            <OpenInBrowserIcon />
          </IconButton>
        </Badge>
      ),
    },
  ];

  const [Open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState({});
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (id, campaigns) => {
    // update campaigns click even if offer available
    if (campaigns && campaigns.isClicked === false) {
      const ref = firebase.firestore().collection('specs');
      ref
        .doc(id)
        .update({
          'campaigns.isClicked': true,
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handlePrint = (rowData) => {
    setRowData(rowData);
    handleClick(rowData.id, rowData.campaigns);
    setOpen(true);
  };

  // const { data, status } = useQuery(
  //   ['DraftQuotes', email],
  //   getCustomerDraftSpecs,
  // );
  // if (status === 'loading') return 'loading';
  // if (status === 'error') return 'error';

  return (
    <div style={{ height: 680, width: 1080 }}>
      <MaterialTable
        data={data}
        columns={columns}
        title="Draft Quotes"
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
          entrance="draft"
        />
      </CustomizedDialog>
    </div>
  );
}
