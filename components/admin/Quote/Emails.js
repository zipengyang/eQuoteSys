import React from 'react';
import { useQuery } from 'react-query';
import { getEmailsByUserId } from '../../../pages/api/getSpec';

export default function Emails({ userId }) {
  const { data, isLoading, isError } = useQuery(
    ['emails', userId],
    getEmailsByUserId,
  );

  if (isLoading) return '...loading';
  if (isError) return '...error';

  console.log(data);
  return (
    <>
      <div>{userId}</div>
      <div>
        {data &&
          data.map((email) => (
            <div>
              <p>{email.subject}</p>
              <p>{email.body}</p>
            </div>
          ))}
      </div>
    </>
  );
}
