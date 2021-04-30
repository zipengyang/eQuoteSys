import React from 'react';
import {
  QuoteDetails,
  RequestForQuote,
  Stepper,
  AppBar,
} from '../../../../../components/stepForms';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useRouter } from 'next/router';
import firebase from '../../../../../firebase/firebase';
import { Paper } from '@material-ui/core';
import { useStyle } from '../../../../../src/styles';
import UploadFile from '../../../../../components/stepForms/UploadFile';
import SpecMain from '../../../../../components/stepForms/SpecMain';

export default function Main({ spec }) {
  const classes = useStyle();
  const router = useRouter();
  const { step, quoteid, uid, tabValue } = router.query;

  function getStepContent(steps) {
    switch (steps) {
      case 0:
        return (
          <SpecMain defaultValues={spec} /> // new quote
        );
      case 1:
        return <QuoteDetails defaultValues={spec} uuid={quoteid} />;

      case 2:
        return <RequestForQuote />;
      case 3:
        return <UploadFile quoteId={quoteid} uid={uid} />;
      default:
        return;
    }
  }

  return (
    <>
      <CssBaseline />
      <AppBar
        quoteid={quoteid}
        step={step}
        tabValue={tabValue}
        className={classes.appBar}
      />
      <main className={classes.root}>
        <Paper className={classes.paper}>
          <Stepper activeStep={parseInt(step)} />
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
