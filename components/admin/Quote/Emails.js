import React from 'react';
import { useQuery } from 'react-query';
import { getEmailsByUserId } from '../../../pages/api/getSpec';
import EmailAccordion from './EmailAccordion';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Typography } from '@material-ui/core';

export default function Emails({ userId, quoteId }) {
  const [state, setState] = React.useState(false);

  const handleChange = (event) => {
    setState(!state);
  };

  const { data, isLoading, isError } = useQuery(
    ['emails', userId],
    getEmailsByUserId,
  );

  if (isLoading) return '...loading';
  if (isError) return '...error';

  const emails = !state
    ? data.filter((item) => item.quoteId === quoteId)
    : data.filter((item) => item.quoteId === '');

  return (
    <>
      <div>
        <div>
          <Typography>
            Filed
            <Switch
              checked={state}
              onChange={handleChange}
              color="primary"
              name="isFlied"
            />
            Others
          </Typography>
        </div>
        <EmailAccordion data={emails} quoteId={quoteId} />
      </div>
    </>
  );
}
