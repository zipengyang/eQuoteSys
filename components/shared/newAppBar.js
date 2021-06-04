import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import { useStyles } from './styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getAssignedToQuotes, getTasksByEmail } from '../../pages/api/getSpec';
import MenuListComponent from '../dashboard/admin/menuList';
import { Container, CssBaseline, Grid, makeStyles } from '@material-ui/core';
import { menus } from './menu';
import firebase from '../../firebase/firebase';
import { useAuth } from '../../firebase/auth';
import NotificationSideBar from '../dashboard/notificationSideBar';
import ProfileMenu from '../dashboard/admin/profileMenu';

export default function NewAppBar() {
  const { user } = useAuth();
  const email = user ? user.email : 'Log In';
  const uid = user ? user.uid : 'uid';

  const router = useRouter();
  const [NSBopen, setNSBopen] = React.useState(false);

  const handleClick = () => {
    router.push(`/users/${uid}/admin`);
  };
  const handleSideBar = () => {
    setNSBopen(!NSBopen);
  };

  //get tasks from cache

  const { data, isLoading, isError } = useQuery(
    ['myTasks', email],
    getTasksByEmail,
  );
  const {
    data: assignedQuotes,
    isLoading: isLoadingQuotes,
    isError: isErrorQuotes,
  } = useQuery(['specs', email], getAssignedToQuotes);

  if (isLoading && isLoadingQuotes) return <p>'...Loading'</p>;
  if (isError && isErrorQuotes) return <p>'...Error'</p>;
  const myTasks = data.length;
  const myAssignedQuotes = assignedQuotes ? assignedQuotes.length : 0;
  const myNotifications = myTasks + myAssignedQuotes;
  return (
    <>
      <AppBar position="absolute">
        <Grid container spacing={2}>
          <Grid item md={2}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            container
            md={6}
            justify="space-around"
            alignItems="center"
          >
            {menus.map((menu) => (
              <Grid item spacing={2}>
                <MenuListComponent
                  menuName={menu.menuName}
                  menuItems={menu.menuItems}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item container md={4} justify="flex-end" alignItems="center">
            <Grid item>
              <IconButton color="inherit" onClick={handleSideBar}>
                <Badge badgeContent={myNotifications} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                size="small"
                onClick={console.log('clicked')}
              >
                <ProfileMenu email={email} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </AppBar>

      <div>
        <NotificationSideBar open={NSBopen} handleSideBar={handleSideBar} />
      </div>
    </>
  );
}
