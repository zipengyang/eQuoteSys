import React from 'react';
import MaterialTable from 'material-table';
import { GRID_ROWS_UPDATED } from '@material-ui/data-grid';
import moment from 'moment';

export default function PromotedQuotesTable({ data }) {
  return (
    <>
      <div style={{ height: 480, width: '100%' }}>
        <MaterialTable
          columns={[
            {
              //   id: 'id',
              //              label: 'QuoteId',
            },
            { field: 'userId', title: 'Contact' },

            {
              field: 'createdDate',
              title: 'Date',
              render: (rowData) =>
                moment(rowData.createdDate.toDate()).format('DD/MM/yy'),
            },
            { field: 'quantity', title: 'Qty' },
            {
              title: 'Amount',
              render: (row) => <div>{row.quantity * row.price}</div>,
            },
            {
              title: 'Discount',
              render: (row) => (
                <div>
                  {row.campaigns.type === 'percentage'
                    ? (row.campaigns.offer * row.quantity * row.price) / 100
                    : row.campaigns.offer}
                </div>
              ),
            },
            {
              title: 'status',
              render: (row) => (
                <div>
                  {row.campaigns.isAccepted === true
                    ? 'Accepted'
                    : row.campaigns.isClicked === true
                    ? 'Opened'
                    : 'Offered'}
                </div>
              ),
            },
          ]}
          data={data}
          // title="Marketing Campaign Management"
          title="Quotes"
          options={{
            selection: false,
            filtering: false,
          }}
        />
      </div>
    </>
  );
}
