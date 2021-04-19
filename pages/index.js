import React from 'react';
import Head from 'next/head';
// import SpecForm from './quote/[quoteid]/[uid]/[step]';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { useAuth } from '../firebase/auth';
import { motion } from 'framer-motion';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

// Our custom easing
let easing = [0.6, -0.05, 0.01, 0.99];

// animate: defines animation
// initial: defines initial state of animation or stating point.
// exit: defines animation when component exits

// Custom variant
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
export default function Home() {
  const { user } = useAuth();
  const uid = user ? user.uid : 'uid';
  const router = useRouter();
  const startNewQuote = () => {
    const quoteId = uuidv4();
    router.push(`/quote/${quoteId}/${uid}/0/?tabValue=0&create=true`);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const steps = [
    { id: 1, image: 'https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2Fsetting.jpg?alt=media&token=cc68c7c8-d36f-4fa9-bfe2-4957dd73cac6', name: 'Step one -- Give Specs' },
    { id: 2, image: 'https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2Fprice.jpg?alt=media&token=f7d64720-5618-4958-afb0-46b09142e877', name: 'Step two -- View Price' },
    { id: 3, image: 'https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2Fsubmit.jpg?alt=media&token=93a33e2f-e8ce-4e8d-9758-bf6c02bf4b2b', name: 'Step three -- Submit Quote' },
    { id: 4, image: 'https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2Fconfirm.jpg?alt=media&token=c48dbce9-7287-4f2f-8988-95829f75464f', name: 'Step four -- Confirm Quote' },
  ];

  return (
    <>
      <Head>
        <title>PCB Online Quote</title>
      </Head>
      {/* <MenuAppBar /> */}
      <Grid container justify="space-between">
        <Grid item>
          <Link href="/">
            <a>
              <img src="/logo.jpg" width="88px" />
            </a>
          </Link>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link href={`/users/uid/selfService`}>
                <a>Customer</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href={`/users/uid/admin/`}>
                <a>Admin</a>
              </Link>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <header className="showcase">
        {/* <h1>Welcome To eXception Online Quote System</h1> */}
        <h1>Four simple steps to have your quote</h1>
        <button className="button" onClick={startNewQuote}>
          Start Your Quote Now
        </button>
      </header>
      <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
        <div className="container center">
          <motion.div variants={stagger} className="step-row">
            {steps.map((step) => (
              <Link key={step.id} href="/guide/[id]" as={`/guide/${step.id}`}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="card"
                >
                  <span className="category">{step.name}</span>
                  <motion.img
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    key={step.image}
                    src={step.image}
                    width={128}
                  />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
