import React, { useState, useReducer, createContext } from 'react';
import clsx from 'clsx';
import nookies from 'nookies';
import { verifyIdToken } from '../../../firebase/firebaseAdmin';
import firebase from '../../../firebase/firebase';
import { useRouter } from 'next/router';

import styles from '../../../styles/Home.module.css';

import CssBaseline from '@material-ui/core/CssBaseline';
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
import { getCustomerAllQuotes } from '../../api/getSpec';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, Typography } from '@material-ui/core';
import MenuAppBar from '../../../components/landing/AppBar';
import HomePageHeader from '../../../components/landing/HomePageHeader';
import QuoteList from '../../../components/portal/QuotesList';
import Notification from '../../../components/portal/Notification';

export default function selfService({ session }) {
  if (session) {
    const { uid, email, email_verified } = session;
    // console.log(email_verified);
    const [newQuote, setNewQuote] = React.useState(false);
    const { data, isLoading, isError } = useQuery(
      ['specs', email],
      getCustomerAllQuotes,
    );
    if (isLoading) return '...loading';
    if (isError) return '...error';
    // console.log(data);
    data.sort((a, b) => b.createdDate - a.createdDate);
    return (
      <div className={styles.container}>
        <Container maxWidth="sm" style={{ overflow: 'auto' }}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
              <MenuAppBar />
            </Grid>

            <Grid item container xs={12} justify="center">
              <HomePageHeader />
            </Grid>
            {data &&
              data.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <QuoteList data={item} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </div>
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
