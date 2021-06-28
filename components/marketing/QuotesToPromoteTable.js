import React from 'react';

export default function QuotesToPromoteTable({ data }) {
  //   console.log(data);
  const newData = data.filter((item) => item.status === 'quoted');
  console.log(newData);

  let dataArray = [];
  newData.map((item) =>
    dataArray.push({
      id: item.id,
      userId: item.userId,
      quanity: item.quantity,
    }),
  );
  console.log(dataArray);
  return <div>quote to promote table</div>;
}
