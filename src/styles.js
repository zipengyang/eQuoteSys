import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles,
} from '@material-ui/core/styles';
import { cyan } from '@material-ui/core/colors';

let theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: cyan,
    secondary: cyan,
  },
});

theme = responsiveFontSizes(theme);

const useStyle = makeStyles(() => ({
  appBar: {
    position: 'relative',
  },
  root: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      width: 1024,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export { theme, useStyle };
