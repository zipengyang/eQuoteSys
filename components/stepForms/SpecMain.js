import React, { useState } from 'react';
import { StepOneForm, StepTwoForm, StepThreeForm } from '.';
import StepTabs from './StepTab';
import { useRouter } from 'next/router';
import firebase from '../../firebase/firebase';
import { Grid, Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import moment from 'moment';
import { useAuth } from '../../firebase/auth';
import publicIp from 'public-ip';

export default function SpecMain({ defaultValues }) {
  const [ip, setIp] = useState();
  const getIP = async () => {
    setIp(await publicIp.v4());
  };
  getIP();

  const { user } = useAuth();

  const router = useRouter();
  const { step, quoteid, uid, tabValue, create } = router.query;
  console.log(defaultValues);
  function getStepContent(tabs) {
    switch (tabs) {
      case 0: // handle new quote
        return (
          <StepOneForm
            handleOnSubmit={handleOnSubmit}
            defaultValues={defaultValues}
          />
        );
      case 1:
        return (
          <StepTwoForm
            handleOnSubmit={handleOnSubmit}
            defaultValues={defaultValues}
          />
        );
      case 2:
        return (
          <StepThreeForm
            handleOnSubmit={handleOnSubmit}
            defaultValues={defaultValues}
          />
        );
      default:
        return;
    }
  }

  // if step===0 then it is new quote, otherwise fetch data from database based on id.

  const handleOnSubmit = async (data) => {
    const ref = firebase.firestore().collection('specs');
    if (parseInt(tabValue) === 0 && create === 'true') {
      data.ipAddress = ip;
      data.userId = user ? user.email : ''; // if already login
      data.status = 'initiated'; // add addtional field here: status: initiated
      data.createdDate = moment(
        firebase.firestore.FieldValue.serverTimestamp(),
      ).format('DD/MM/YYYY');

      await ref
        .doc(quoteid)
        .set(data)
        .catch((err) => {
          console.error(err);
        });
    } else {
      await ref
        .doc(quoteid)
        .update(data)
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12} md={6}>
        <StepTabs tabValue={parseInt(tabValue)} />
      </Grid>
      <Grid item xs={12} md={12}>
        {getStepContent(parseInt(tabValue))}
      </Grid>
    </Grid>
  );
}
