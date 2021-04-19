import React, { useState } from 'react';
import {
  StepOneForm,
  StepTwoForm,
  QuoteDetails,
  RequestForQuote,
  Stepper,
  AppBar,
} from '../../../../../components/stepForms';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useRouter } from 'next/router';
import firebase from '../../../../../firebase/firebase';
import { updateSpec, createSpec } from '../../../../api/getSpec';
import { useMutation } from 'react-query';
import { Grid, Paper } from '@material-ui/core';
import { useStyle } from '../../../../../src/styles';
import UploadFile from '../../../../../components/stepForms/UploadFile';
import Modal from '../../../../../components/shared/Modal';
import StepTabs from '../../../../../components/stepForms/StepTab';

export default function Main({ spec }) {
  const classes = useStyle();
  const router = useRouter();
  const { step, quoteid, uid } = router.query;
  const [showModal, setShowModal] = useState(false);

  function getStepContent(steps) {
    switch (steps) {
      case 0:
        return (
          <>
            <Grid container justify="center" spacing={3}>
              <Grid item>
                <StepTabs />
              </Grid>
              <Grid item>
                <StepOneForm handleOnSubmit={handleOnSubmit} uuid={quoteid} />
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <Grid container justify="center" spacing={3}>
            <Grid item>
              <StepTabs />
            </Grid>
            <Grid item>
              <StepOneForm
                handleOnSubmit={handleOnSubmit}
                defaultValues={spec}
                uuid={quoteid}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <StepTwoForm
            handleOnSubmit={handleOnSubmit}
            defaultValues={spec}
            uuid={quoteid}
          />
        );
      case 3:
        return <QuoteDetails defaultValues={spec} uuid={quoteid} />;
      case 4:
        return <RequestForQuote setShowModal={setShowModal} />;
      case 5:
        return (
          <UploadFile quoteId={quoteid} uid={uid} setShowModal={setShowModal} />
        );
      default:
        return;
    }
  }

  // if step===0 then it is new quote, otherwise fetch data from database based on id.
  const { mutateAsync, isLoading } =
    step === '0' ? useMutation(createSpec) : useMutation(updateSpec);

  const handleOnSubmit = async (data) => {
    const status = 'initiated';
    await mutateAsync({ quoteid, status, ...data });
  };

  return (
    <>
      <CssBaseline />
      <AppBar quoteid={quoteid} step={step} className={classes.appBar} />
      <main className={classes.root}>
        <Modal showModal={showModal} setShowModal={setShowModal} />
        <Paper className={classes.paper}>
          <Stepper activeStep={parseInt(step) - 1} />
        </Paper>
        <Paper className={classes.paper}>
          {getStepContent(parseInt(step))}
        </Paper>
      </main>
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  const ref = firebase.firestore().collection('specs');
  const data = await ref
    .doc(query.quoteid)
    .get()
    .then((result) => result.data());

  return {
    props: {
      spec: data || '',
    },
  };
};
