import React, { useState, useReducer, createContext } from 'react';
import clsx from 'clsx';
import nookies from 'nookies';
import { verifyIdToken } from '../../../firebase/firebaseAdmin';
import firebase from '../../../firebase/firebase';
import { useRouter } from 'next/router';
import QuoteHistory from '../../../components/dashboard/quoteList';
import DraftQuotesList from '../../../components/dashboard/draftQuoteList';
import DbAppBar from '../../../components/dashboard/dbAppBar';
import { useStyles } from '../../../components/dashboard/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DbDrawer from '../../../components/dashboard/dbDrawer';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { v4 as uuidv4 } from 'uuid';
import { useQuery, useQueries } from 'react-query';
import {
  getCustomerAllQuotes,
  getCustomerDraftSpecs,
  getDraftSpecs,
  getQuotesByEmailAndStatus,
  getUser,
} from '../../api/getSpec';
import { QuoteTemplate } from '../../../components/stepForms';
import QuoteDetailForPortal from '../../../components/dashboard/QuoteDetailForPortal';
// import UploadFileInPortal from '../../../components/dashboard/selfService/UploadFileInPortal';
import DraftQuoteTable from '../../../components/dashboard/selfService/draftQuoteTable';
import SubmittedQuoteTable from '../../../components/dashboard/selfService/submittedQuoteTable';
import Submitted from '../../../components/dashboard/selfService/content/submitted';
import SSDrawer from '../../../components/dashboard/selfService/ssDrawer';
import { drawerReducer } from '../../../components/shared/drawerReducer';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const dispatchContext = createContext();

export default function selfService({ session }) {
  if (session) {
    const { uid, email, email_verified } = session;
    console.log(email_verified);

    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const router = useRouter();

    const [open, setOpen] = useState(true);
    const handleDrawerOpen = () => {
      setOpen(!open);
    };
    const handleSignout = async () => {
      await firebase.auth().signOut();
      window.location.href = '/';
    };

    const startNewQuote = () => {
      const quoteId = uuidv4();
      router.push(
        `/quote/${quoteId}/${session.userId}/0/?tabValue=0&create=true`,
      );
    };

    function getDisplayContent(content) {
      switch (content) {
        case 'submitted':
          // return <Submitted />;
          return <SubmittedQuoteTable />;

        case 'draft':
          return <DraftQuoteTable />;

        case 'customer':
          return <div>this is profile page.</div>;

        default:
          return;
      }
    }

    const [state, dispatch] = useReducer(drawerReducer, {
      menuSelected: 'submitted',
      status: 'submitted',
    });

    const { data, isLoading, isError } = useQuery(
      ['specs', email, state.status],
      getQuotesByEmailAndStatus,
    );
    if (isLoading) return 'loading...';
    if (isError) return 'error...';

    return (
      <dispatchContext.Provider value={{ data, dispatch, email }}>
        <div className={classes.root}>
          <CssBaseline />
          {/* verify email address */}

          <Dialog
            open={!email_verified}
            aria-labelledby="email-verification-dialog"
            fullWidth
            maxWidth="md"
          >
            <DialogContent>
              <Alert severity="warning" variant="filled">
                <Typography variant="h5">
                  please verify your email address and click the login button to
                  login -->
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push('/quote/quoteid/uid/step/login')}
                  >
                    login
                  </Button>
                </Typography>
              </Alert>
            </DialogContent>
          </Dialog>

          <DbAppBar
            email={session.email}
            handleDrawerOpen={handleDrawerOpen}
            open={open}
            handleSignout={handleSignout}
          />
          <SSDrawer
            handleDrawerOpen={handleDrawerOpen}
            open={open}
            // menuClicked={menuClicked}
            dispatch={dispatch}
            uid={session.userId}
            role={'customer'}
          />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3} justify="center">
                <Grid
                  container
                  justify="flex-end"
                  alignItems="flex-end"
                  spacing={6}
                >
                  <Grid item xs={12}>
                    <Tooltip title="start a new quote" aria-label="add">
                      <Fab
                        color="primary"
                        aria-label="add"
                        onClick={startNewQuote}
                      >
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      {getDisplayContent(state.menuSelected)}
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </main>
        </div>
      </dispatchContext.Provider>
    );
  } else {
    <div>
      <CircularProgress />
    </div>;
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email, email_verified } = token;

    return {
      props: {
        session: {
          email: email,
          userId: uid,
          email_verified,
        },
      },
    };
  } catch (err) {
    context.res.writeHead(302, { Location: '/quote/quoteid/uid/step/login' });
    context.res.end();
    return { props: {} };
  }
}
