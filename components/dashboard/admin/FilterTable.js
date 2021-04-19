import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Badge from '@material-ui/core/Badge';
import moment from 'moment';
import { Grid, Button } from '@material-ui/core';
import firebase from '../../../firebase/firebase';
import FilterForm from '../../../components/dashboard/admin/FilterForm';
import CampaignSelector from '../../../components/marketing/CampaignSelector';
import { getDraftSpecs } from '../../../pages/api/getSpec';
import { useQuery } from 'react-query';
import CampaignSelectList from '../../marketing/CampaignSelectList';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'QuoteId',
  },
  { id: 'contact', numeric: true, disablePadding: false, label: 'Contact' },
  {
    id: 'ipAddress',
    numeric: true,
    disablePadding: false,
    label: 'IP Address',
  },
  { id: 'weight', numeric: true, disablePadding: false, label: 'Weight' },
  {
    id: 'classification',
    numeric: true,
    disablePadding: false,
    label: 'Classification',
  },
  {
    id: 'submittedDate',
    numeric: true,
    disablePadding: false,
    label: 'Submit Date',
  },
  { id: 'leadtime', numeric: true, disablePadding: false, label: 'LeadTime' },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Qty' },
  {
    id: 'totalPrice',
    numeric: true,
    disablePadding: false,
    label: 'TotalPrice',
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, handleFilterOpen, handleCampaignSelect } = props;
  const handleFilterClick = () => {
    handleFilterOpen();
  };
  const handleCampClick = () => {
    handleFilterOpen();
    handleCampaignSelect();
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Grid container justify="center">
          <Grid item xs={6}>
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCampClick}
            >
              Add to Campaign
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Draft Quotes
        </Typography>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : ( */}
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list" onClick={handleFilterClick}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      {/* )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 600,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function FilterTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [campaignSelector, setCampaignSelector] = React.useState(false);
  const [filterValues, setFilterValues] = React.useState({
    minWeight: 0.0,
    maxWeight: 2.0,
    isExcludeOffered: false,
    // toDate: Date.now(),
  });
  const handleOnSubmit = (data) => {
    console.log(data);
    setFilterValues({
      minWeight: parseFloat(data.minWeight),
      maxWeight: parseFloat(data.maxWeight),
      isExcludeOffered: data.isExcludeOffered,
    });
    console.log(filterValues);
  };
  // const draft = data.filter((items) => items.status === 'draft');
  // const rows = draft;

  //fetch data
  const { data, status } = useQuery('DraftSpecs', getDraftSpecs);
  if (status === 'loading') return 'loading';
  if (status === 'error') return 'error';
  console.log(data);

  const rows = data.filter((items) =>
    parseFloat(items.weight) >= filterValues.minWeight &&
    parseFloat(items.weight) <= filterValues.maxWeight &&
    filterValues.isExcludeOffered
      ? !items.campaigns
      : true,
  );

  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen);
  };
  const handleCampaignSelect = () => {
    setFilterOpen(false); // close filter
    setCampaignSelector(!campaignSelector);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      // if new selected item is not in the array
      newSelected = newSelected.concat(selected, id); // push it into the array
    } else if (selectedIndex === 0) {
      // if selected the first one
      newSelected = newSelected.concat(selected.slice(1)); // select all excpet first one
    } else if (selectedIndex === selected.length - 1) {
      // if the last one
      newSelected = newSelected.concat(selected.slice(0, -1)); // select all except last one
    } else if (selectedIndex > 0) {
      // select any middle one,
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    console.log(newSelected);
  };
  // add to campaign  --  will use cloud function instead
  const handleCampSubmit = (data) => {
    console.log(data);
    const ref = firebase.firestore().collection('specs');
    selected &&
      selected.map((item) => {
        ref
          .doc(item)
          .update({
            campaigns: {
              campaignId: data.id,
              isClicked: false,
              isAccepted: false,
              offerDate: data.startedDate,
              type: data.type,
              offer: data.offer,
              expiredDate: data.expiredDate,
            },
          }) // update campaign counter
          // .then(() => {
          //   // create subcollection
          //   ref.doc(item).collection('campaigns').doc(data.name).set({
          //     isClicked: false,
          //     isAccepted: false,
          //     offerDate: '11/03/2021',
          //     type: 'fixed',
          //     discountAmount: 260,
          //     discountPercentage: 5

          //   });
          // })

          .then(() => {
            setCampaignSelector(false); //close form
            setSelected([]); // reset selection
          })
          .catch((err) => console.log(err));
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const vSize = filterOpen || campaignSelector ? 8 : 12;
  return (
    // <div className={classes.root}>
    <Grid container spacing={3}>
      <Grid item xs={vSize} md={vSize} lg={vSize}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleFilterOpen={handleFilterOpen}
            handleCampaignSelect={handleCampaignSelect}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const offer = row.campaigns ? row.campaigns.offer : null;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <Badge
                          color="secondary"
                          badgeContent={offer}
                          invisible={!row.campaigns}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </TableCell>
                        </Badge>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>

                        <TableCell align="right">{row.userId}</TableCell>
                        <TableCell align="right">{row.ipAddress}</TableCell>
                        <TableCell align="right">{row.weight}</TableCell>
                        <TableCell align="right">
                          {row.classification}
                        </TableCell>
                        <TableCell align="right">{row.draftDate}</TableCell>
                        <TableCell align="right">{row.leadtime}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Grid>
      {filterOpen && (
        <Grid item xs={12 - vSize} md={12 - vSize} lg={12 - vSize}>
          <Paper className={classes.paper}>
            <FilterForm handleOnSubmit={handleOnSubmit} />
          </Paper>
        </Grid>
      )}
      {campaignSelector && (
        <Grid item xs={12 - vSize} md={12 - vSize} lg={12 - vSize}>
          <Paper className={classes.paper}>
            {/* <CampaignSelector handleCampSubmit={handleCampSubmit} /> */}
            <CampaignSelectList handleCampSubmit={handleCampSubmit} />
          </Paper>
        </Grid>
      )}
    </Grid>
    // </div>
  );
}
