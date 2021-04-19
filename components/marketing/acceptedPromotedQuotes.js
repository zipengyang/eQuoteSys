import React from 'react';
import MaterialTable from 'material-table';
import { useQuery } from 'react-query';
import { getAcceptedPromotedSpecs } from '../../pages/api/getSpec';

export default function AcceptedPromotedQuotes() {
  const { data, status } = useQuery(
    'AcceptedPromotedSpecs',
    getAcceptedPromotedSpecs,
  );
  if (status === 'loading') return 'loading';
  if (status === 'error') return 'error';

  return (
    <>
      <div style={{ height: 580, width: '100%' }}>
        <MaterialTable
          columns={[
            {
              //   id: 'id',
              //              label: 'QuoteId',
            },
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
            // {
            //   field: 'campaigns.campaignId',
            //   title: 'Offered',
            //   render: (row) => <div>{!row.campaigns ? 'no' : 'yes'}</div>,
            // },
          ]}
          data={data}
          // title="Marketing Campaign Management"
          title="Accepted Promoted Quotes"
          options={{
            selection: false,
            filtering: true,
          }}
        />
      </div>
    </>
  );
}
