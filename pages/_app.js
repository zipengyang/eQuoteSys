import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import '../src/styles.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../firebase/auth';
import { AnimateSharedLayout } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Router from 'next/router';

const queryClient = new QueryClient();

export default function MyApp(props) {
  Router.onRouteChangeStart = (url) => {
    NProgress.start();
  };
  Router.onRouteChangeComplete = () => NProgress.done();
  Router.onRouteChangeError = () => NProgress.done();

  const { Component, pageProps } = props;
  // const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AuthProvider>
            <AnimateSharedLayout>
              <Component {...pageProps} />
            </AnimateSharedLayout>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
