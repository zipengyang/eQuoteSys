import React, { useState, useReducer, createContext, useContext } from 'react';
import clsx from 'clsx';
import nookies from 'nookies';
import { verifyIdToken } from '../../../firebase/firebaseAdmin';
import * as admin from 'firebase-admin';
import firebase from '../../../firebase/firebase';
import DbAppBar from '../../../components/dashboard/dbAppBar';
import { useStyles } from '../../../components/dashboard/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DbDrawer from '../../../components/dashboard/dbDrawer';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  CampReport,
  Customer,
  Draft,
  Marketing,
  Promoted,
  Submitted,
} from '../../../components/dashboard/admin/content/index';

import { useQueries, useQuery } from 'react-query';
import { getAllSpecs, getAllUsers } from '../../api/getSpec';
import DraftQuoteTable from '../../../components/dashboard/admin/DraftQuoteTable';
import SubmittedQuoteTable from '../../../components/admin/SubmittedQuote';
import CampaignTable from '../../../components/marketing/CampaignTable';
import Statics from '../../../components/dashboard/admin/Statics';
import { drawerReducer } from '../../../components/shared/drawerReducer';
import PromotedQuotes from '../../../components/dashboard/admin/promotedQuotes';
import AccordionTimeLine from '../../../components/dashboard/admin/accordionTimeLine';
import ActivityTab from '../../../components/dashboard/admin/activity/activityTab';
import NotificationSideBar from '../../../components/dashboard/notificationSideBar';
import NewAppBar from '../../../components/admin/newAppBar';
import QuoteTimeLineTabs from '../../../components/admin/Quote/QuoteTimeLineTabs';
import QuotesForCampaign from '../../../components/marketing/QuotesForCampaign';

// context
export const dispatchContext = createContext();

export default function selfService({ session }) {
  if (session) {
    const { uid, email } = session;

    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [open, setOpen] = React.useState(true);
    const [NSBopen, setNSBopen] = React.useState(false);
    const handleDrawerOpen = () => {
      setOpen(!open);
    };
    const handleNotificationSideBar = () => {
      setNSBopen(!NSBopen);
      // could get data from appbar and pass onto notification component by using useState
    };
    const handleSignout = async () => {
      await firebase.auth().signOut();
      window.location.href = '/';
    };
    // router:
    function getDisplayContent(content) {
      switch (content) {
        case 'submitted':
          return <SubmittedQuoteTable data={data} />;
        case 'draft':
          return <DraftQuoteTable data={data} />;
        case 'quoted':
          return <QuotesForCampaign data={data} />;
        case 'promoted':
          return <PromotedQuotes data={data} />;
        case 'customer':
          return <Customer data={data} />;
        case 'marketing':
          return <CampaignTable />;
        case 'campReport':
          return <CampReport rowData={state.camps} data={data} />;
        case 'opened':
          return <Promoted data={data} />;
        case 'accepted':
          return <Promoted data={data} />;
        case 'report':
          return <Statics data={data} camps={state.camps} />;
        case 'customerTimeLine':
          // return <AccordionTimeLine user={state.camps} />;
          return <ActivityTab user={state.camps} />;
        case 'quoteAllInOneView':
          return <QuoteTimeLineTabs data={state.camps} />;
        default:
          return;
      }
    }

    const [state, dispatch] = useReducer(drawerReducer, {
      menuSelected: 'submitted',
      status: 'submitted',
      camps: {},
    });

    //fetch data
    const cache = state.menuSelected === 'customer' ? 'users' : 'specs';
    const query = state.menuSelected === 'customer' ? getAllUsers : getAllSpecs;

    const { data, isLoading, isError } = useQuery(cache, query);

    if (isLoading) return 'loading...';
    if (isError) return 'error...';

    return (
      <dispatchContext.Provider value={{ dispatch }}>
        {/* <div className={classes.root}> */}
        <div>
          <CssBaseline />
          {/* <DbAppBar */}
          <NewAppBar
            email={email}
            handleDrawerOpen={handleDrawerOpen}
            handleNotificationSideBar={handleNotificationSideBar}
            open={open}
            handleSignout={handleSignout}
          />
          {/* <DbDrawer handleDrawerOpen={handleDrawerOpen} open={open} uid={uid} /> */}
          <NotificationSideBar open={NSBopen} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container className={classes.container}>
              {getDisplayContent(state.menuSelected)}
            </Container>
          </main>
        </div>
      </dispatchContext.Provider>
    );
  } else {
    <Grid container justify="center" alignItems="center">
      <Grid item>
        <CircularProgress />
      </Grid>
      ;
    </Grid>;
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    // is admin role?
    const ref = admin.firestore().collection('admin');
    const role = await ref
      .doc(email)
      .get()
      .then((result) => result.data());

    if (role.length === 0) {
      // if is not Admin, require login
      window.location.href = '/quote/quoteid/uid/admin/login';
    }

    return {
      props: {
        session: {
          email,
          uid,
        },
      },
    };
  } catch (err) {
    context.res.writeHead(302, { Location: '/quote/quoteid/uid/admin/login' });
    context.res.end();
    return { props: {} };
  }
}
