import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import CheckIcon from '@material-ui/icons/Check';
import PersonIcon from '@material-ui/icons/Person';
import { dispatchContext } from '../../pages/users/[id]/admin';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function CampaignCard({
  number,
  status,
  percentage,
  icon,
  handleClick,
}) {
  // const { dispatch } = useContext(dispatchContext);
  const classes = useStyles();

  const cardClicked =
    status === 'Opened'
      ? 'opened'
      : status === 'Accepted'
      ? 'accepted'
      : 'promoted';

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {icon === 1 && <AssessmentIcon />}
        {icon === 2 && <AddToHomeScreenIcon />}
        {icon === 3 && <CheckIcon />}
        {icon === 4 && <PersonIcon />}

        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {number} -- ({percentage})
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {status}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
