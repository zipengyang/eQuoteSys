import React from 'react';
import { useRouter } from 'next/router';
import Calc_Array from '../utils/panelisation';
import { Grid, Button } from '@material-ui/core';
import { useMutation } from 'react-query';
import { createSpec, updateStatus } from '../../pages/api/getSpec';
import { v4 as uuidv4 } from 'uuid';
import PriceTable from './PriceTable';
import firebase from '../../firebase/firebase';
import moment from 'moment';
import QuoteTemplate from './QuoteTemplate';
// import { dispatchContext } from '../../pages/users/[id]/selfService';
import { useAuth } from '../../firebase/auth';

export default function QuoteDetails({ defaultValues, uuid }) {
  const { user } = useAuth();

  const router = useRouter();
  const { quoteid, uid } = router.query;

  // temparay include price here to fix the NaN issue.
  const { supplied_as, step, xout, width, length, qty } = defaultValues;
  // console.log(price);

  // make a copy of orignial quote. -- will use firebase function instead

  const { mutateAsync, isLoading } = useMutation(createSpec);
  const editQuote = async () => {
    const quoteid = uuidv4(); //new id
    const originalId = uuid;
    await mutateAsync({ quoteid, originalId, ...defaultValues });
    router.push(`/quote/${quoteid}/${uid}/0?tabValue=0`);
  };
  const handleNextStep = () => {
    //  if login,skip contact form
    const nextStep = uid === 'uid' ? '2' : '3';
    router.push(`/quote/${quoteid}/${uid}/${nextStep}`);
  };

  const handleSaveForLater = async () => {
    // if already login, update status to 'saveForLater' and redirect to self-service page, otherwise, rquire to login.
    if (uid && uid != 'uid') {
      // already login
      const ref = firebase.firestore().collection('specs');
      // update status
      await ref
        .doc(quoteid)
        .update({
          status: 'draft',
        })
        .then(() => {
          // log activity using cloud function
          const data = { quoteId: quoteid, activity: 'save quote' };

          const logActivity = firebase
            .functions()
            .httpsCallable('logCustomerActivity');
          logActivity(data);
        })
        .catch((err) => {
          console.error(err);
        });
      router.push(`/users/${uid}/selfService`);
    }
    // set step to '9' for login to handle route afterward.
    else router.push(`/quote/${quoteid}/uid/9/login`);
  };

  return (
    <>
      <Grid container justify="space-between" spacing={3}>
        <Grid item xs={12}>
          <QuoteTemplate data={defaultValues} />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={editQuote}
          >
            Edit
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleNextStep}
          >
            submit
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSaveForLater}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
