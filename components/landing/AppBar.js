import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Grid, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CloseIcon from '@material-ui/icons/Close';
import { useAuth } from '../../firebase/auth';
import firebase from '../../firebase/firebase';
import Notification from '../portal/Notification';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 428,
    // maxHeight: 40,
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    // backgroundColor: red[500],
    width: theme.spacing(8),
    height: theme.spacing(4),
  },
}));

export default function MenuAppBar() {
  const auth = useAuth();
  const { user } = auth;
  user && console.log(user.email);
  const classes = useStyles();
  // const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [signUpOpen, setSignUpOpen] = React.useState(false);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    handleClose();
    setAuthOpen(!authOpen);
  };
  const handleSignUp = () => {
    handleClose();
    setSignUpOpen(!signUpOpen);
  };
  const handleSignout = async () => {
    await firebase.auth().signOut();
    window.location.href = '/';
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar position="sticky" color="secondary">
          <Toolbar>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={1}>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                {/* menu inside the hanberge  */}
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
                  <MenuItem onClick={() => handleSignIn()}>
                    {/* <VpnKeyIcon /> */}
                    Sign In
                  </MenuItem>
                  <MenuItem onClick={() => handleSignUp()}>
                    {/* <PersonAddIcon /> */}
                    Sign Up
                  </MenuItem>

                  {/* <MenuItem onClick={handleSignout}>Sign Out</MenuItem> */}
                </Menu>
              </Grid>
              {/* <Grid item>{user && user.email}</Grid> */}
              {user && (
                <Grid item xs={8}>
                  <Notification email={user.email} />
                </Grid>
              )}
              {/* {!user && (
                <Grid item xs={1}>
                  <IconButton
                    color="inherit"
                    onClick={() => setAuthOpen(!authOpen)}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Grid>
              )} */}

              {user && (
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
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>

                    <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
                  </Menu>
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
      {/* {authOpen && ( */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={authOpen}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={10}>
              <img
                aria-label="exceptionpcb"
                className={classes.avatar}
                src="https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2FLogo.jpg?alt=media&token=b4dba3eb-a1c8-42ec-846b-c191f11b6746"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => setAuthOpen(!authOpen)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <SignIn />
        </DialogContent>
      </Dialog>

      {/* sign up */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={signUpOpen}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={10}>
              <img
                aria-label="exceptionpcb"
                className={classes.avatar}
                src="https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2FLogo.jpg?alt=media&token=b4dba3eb-a1c8-42ec-846b-c191f11b6746"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => setSignUpOpen(!signUpOpen)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <SignUp />
        </DialogContent>
      </Dialog>
    </>
  );
}
