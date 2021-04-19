import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import ExplicitIcon from '@material-ui/icons/Explicit';
import TouchAppIcon from '@material-ui/icons/TouchApp';

import { useStyles } from './styles';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { dispatchContext } from '../../pages/users/[id]/admin';

export default function DbDrawer({ open, handleDrawerOpen, role }) {
  const { dispatch } = useContext(dispatchContext);

  const classes = useStyles();
  const handleClick = () => {
    handleDrawerOpen();
  };
  return (
    <div>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleClick}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* <ListItem button onClick={() => menuClicked('submitted')}> */}
          <ListItem button onClick={() => dispatch({ type: 'submitted' })}>
            <ListItemIcon>
              <AssignmentTurnedInIcon />
            </ListItemIcon>
            <ListItemText primary="Submitted Quotes" />
          </ListItem>

          {/* <ListItem button onClick={() => menuClicked( 'draft' )}> */}
          <ListItem button onClick={() => dispatch({ type: 'draft' })}>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Draft Quotes" />
          </ListItem>
          {/* {role === 'customer' && (
            <ListItem button onClick={() => menuClicked('profile')}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          )} */}
          {role !== 'customer' && ( //temparary, willl use uid role in the future.
            <ListItem button onClick={() => dispatch({ type: 'promoted' })}>
              <ListItemIcon>
                <ExplicitIcon />
              </ListItemIcon>
              <ListItemText primary="Promoted Quotes" />
            </ListItem>
          )}
          {role !== 'customer' && ( //temparary, willl use uid role in the future.
            <ListItem button onClick={() => dispatch({ type: 'marketing' })}>
              <ListItemIcon>
                <InsertChartIcon />
              </ListItemIcon>
              <ListItemText primary="Marketing" />
            </ListItem>
          )}
          <ListItem button onClick={() => dispatch({ type: 'report' })}>
            <ListItemIcon>
              <InsertChartIcon />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>
          {role !== 'customer' && ( //temparary, willl use uid role in the future.
            <ListItem button onClick={() => dispatch({ type: 'customer' })}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItem>
          )}
        </List>
        <Divider />
        {/* <List>{secondaryListItems}</List> */}
      </Drawer>
    </div>
  );
}
