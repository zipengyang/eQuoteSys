import MaterialTable from 'material-table';
import React from 'react';

export default function QuoteDetailAccordion({ data }) {
  // const array = [];
  // const {
  //   assignedTo,
  //   createdDate,
  //   ipAddress,
  //   status,
  //   progress,
  //   userId,
  //   price,
  //   quantity,
  //   leadtime,
  // } = data;
  // array.push({ item: 'Customer', value: userId });
  // array.push({ item: 'IP', value: ipAddress });
  // array.push({ item: 'Created Date', value: createdDate });
  // array.push({ item: 'Status', value: status });
  // array.push({ item: 'Progress', value: progress });
  // array.push({ item: 'Leadtime', value: leadtime });
  // array.push({ item: 'Quantity', value: quantity });
  // array.push({ item: 'Price', value: price });

  const columns = [
    { field: 'item', title: 'Item' },
    { field: 'value', title: 'Value' },
  ];
  return (
    <div style={{ width: 480 }}>
      <MaterialTable
        data={data}
        columns={columns}
        options={{
          filtering: false,
          exportButton: false,
          search: false,
          paging: false,
          showTitle: false,
          toolbar: false,
        }}
      />
    </div>
  );
}
