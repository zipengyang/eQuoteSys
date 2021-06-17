import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import AccordionHolder from '../components/landing/AccordionHolder';
import { Container, Grid } from '@material-ui/core';
import HomePageHeader from '../components/landing/HomePageHeader';
import MenuAppBar from '../components/landing/AppBar';

export default function Home() {
  const [newQuote, setNewQuote] = React.useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>PCB Online Quote System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="sm" style={{ margin: 'none', overflow: 'auto' }}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <MenuAppBar />
          </Grid>
          <Grid item xs={12}>
            <HomePageHeader handleNewQuote={setNewQuote} />
          </Grid>
          {newQuote && (
            <Grid item xs={12}>
              <AccordionHolder />
            </Grid>
          )}
        </Grid>
      </Container>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
