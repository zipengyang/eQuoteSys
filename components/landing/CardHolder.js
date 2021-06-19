import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { Paper, TextField } from '@material-ui/core';
import SASwitch from './SASwitch';
import SuppAsArray from './SuppAsArray';
import Dimension from './Dimension';
import LayerSlider from './Layer';
import LeadTimePicker from './LeadTimePicker';
import MaterialSelection from './MaterialSelection';
import QuantityInput from './QuantityInput';
import { HelpText } from './HelpText';

const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: 380,
    // maxWidth: 428,
  },
  media: {
    height: 0,
    // minWidth: 400,
    // maxWidth: 428,
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
    backgroundColor: red[500],
  },
}));

export default function CardHolder({ field }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing>
        <Typography variant="subtitle2">{HelpText[field].title}</Typography>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show helper text"
        >
          {!expanded && <InfoIcon color="secondary" />}
          {expanded && <CloseIcon />}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Paper elevation={6}>
            <Typography paragraph>{HelpText[field].text}</Typography>
          </Paper>
        </CardContent>
      </Collapse>
      {field === 'suppliedAs' && <CardHeader title={<SASwitch />} />}
      {field === 'suppliedAsArray' && <CardHeader title={<SuppAsArray />} />}
      {field === 'dimension' && <CardHeader title={<Dimension />} />}
      {field === 'layer' && <CardHeader title={<LayerSlider />} />}
      {field === 'material' && <CardHeader title={<MaterialSelection />} />}
      {field === 'leadtime' && <CardHeader title={<LeadTimePicker />} />}
      {field === 'quantity' && <CardHeader title={<QuantityInput />} />}
    </Card>
  );
}
