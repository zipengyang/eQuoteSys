import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useAuth } from '../../firebase/auth';
import firebase from '../../firebase/firebase';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const { user } = useAuth();
  const router = useRouter();
  const { quoteid, step, tabValue } = props;
  const displayName = !user ? 'New Customer' : user.email;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Exception PCB
          </Typography>
          <Typography variant="h6" className={classes.title}>
            welcome , {displayName}
          </Typography>
          {!user && (
            <PersonAddIcon
              onClick={() => {
                router.push(
                  `/quote/${quoteid}/uid/${step}/login?tabValue=${tabValue}`,
                );
              }}
            />
          )}
          {user && (
            <Button
              color="inherit"
              onClick={async () => {
                await firebase.auth().signOut();
                window.location.href = '/';
              }}
            >
              SignOut
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
