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
import { useStyles } from './styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getTasksByEmail } from '../../pages/api/getSpec';
import MenuListComponent from './admin/menuList';

export default function DbAppBar({
  email,
  open,
  handleDrawerOpen,
  handleNotificationSideBar,
  handleSignout,
}) {
  const classes = useStyles();
  const router = useRouter();
  const menuItems = ['submitted', 'draft', 'promoted'];
  // const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    handleDrawerOpen();
  };
  const handleSideBar = () => {
    handleNotificationSideBar();
  };

  //get tasks from cache

  const { data, isLoading, isError, error } = useQuery(
    ['myTasks', email],
    getTasksByEmail,
  );

  if (isLoading) return <p>'...Loading'</p>;
  if (isError) return <p>'...Error'</p>;

  return (
    <div>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleClick}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          {/* <MenuListComponent menuName="Quote" menuItems={menuItems} />

          <MenuListComponent menuName="Marketing" menuItems={menuItems} /> */}
          {/* <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography> */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Welcome, {email}
          </Typography>
          <IconButton color="inherit" onClick={handleSideBar}>
            <Badge badgeContent={data.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {email ? (
            <IconButton color="inherit" onClick={handleSignout}>
              <ExitToAppIcon />
            </IconButton>
          ) : (
            <PersonAddIcon
              onClick={() => {
                router.push(`/quote/quoteid/uid/step/login`);
              }}
            />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
