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

export default function DbAppBar({
  email,
  open,
  handleDrawerOpen,
  handleSignout,
}) {
  const classes = useStyles();
  const router = useRouter();

  // const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    handleDrawerOpen();
  };

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
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Welcome, {email}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
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
