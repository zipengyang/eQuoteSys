import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    maxWidth: 428,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // backgroundColor: red[500],
    width: theme.spacing(12),
    height: theme.spacing(6),
  },
}));

export default function HomePageHeader({ handleNewQuote }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <img
            aria-label="exceptionpcb"
            className={classes.avatar}
            src="https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2FLogo.jpg?alt=media&token=b4dba3eb-a1c8-42ec-846b-c191f11b6746"
          />
        }
        title={
          <Typography variant="overline" color="secondary" align="center">
            Get instance price for your PCB
          </Typography>
        }
      />
      <CardMedia
        className={classes.media}
        image="https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2Fbg2.jpg?alt=media&token=e24aee10-ebe3-4d7c-91af-af55f2ca07f6'"
        title="Paella dish"
      />
      <CardContent>
        <Typography
          variant="h4"
          color="textSecondary"
          component="p"
          align="center"
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleNewQuote(true)}
          >
            Start a quote now
          </Button>
        </Typography>
      </CardContent>
    </Card>
  );
}
