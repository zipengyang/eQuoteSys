import React from 'react';
import { useQuery } from 'react-query';
import { getAllSpecs } from '../../../../pages/api/getSpec';
import SubmittedQuoteTable from '../SubmittedQuote';
import Draft from './draft';
import Submitted from './submitted';

export default function OverallQuotes({ content }) {
  const { data, status } = useQuery('specs', getAllSpecs);
  if (status === 'loading') return 'loading...';
  if (status === 'error') return 'error...';
  //   console.log(data);
  const submittedFilter = data.filter((items) => {
    items.status === 'submitted';
  });
  console.log(submittedFilter);
  const draftFilter = data.filter((items) => {
    items.status === 'draft';
  });
  //   submittedFilter = data.filter((items) => {
  //     items.status = 'submitted';
  //   });
  switch (content) {
    case 'submitted':
      return <SubmittedQuoteTable data={submittedFilter} />;

    case 'draft':
      return <Draft />;

    default:
      return;
  }
  return <div>this is over quotes page.</div>;
}
