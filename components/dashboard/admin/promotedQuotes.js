import React from 'react';

import MaterialTable from 'material-table';

export default function PromotedQuotes({ data }) {
  data = data.filter((items) => !!items.campaigns);

  return (
    <>
      <div style={{ height: 580, width: '100%' }}>
        <MaterialTable
          columns={[
            { field: 'userId', title: 'Contact' },

            {
              field: 'createdDate',
              title: 'Date',
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
          title="Promoted Quotes"
          options={{
            selection: false,
            filtering: true,
          }}
        />
      </div>
    </>
  );
}
