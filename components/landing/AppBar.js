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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 428,
    maxHeight: 40,
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
  const classes = useStyles();
  // const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [authOpen, setAuthOpen] = React.useState(false);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            <Grid container justify="space-between">
              <Grid item>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              {user && user.email}
              {!user && (
                <Grid item>
                  <IconButton
                    color="inherit"
                    onClick={() => setAuthOpen(!authOpen)}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Grid>
              )}

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
          {/* <SignUp /> */}
        </DialogContent>
      </Dialog>
      {/* )} */}
    </>
  );
}
