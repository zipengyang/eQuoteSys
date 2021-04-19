import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Badge,
} from '@material-ui/core';
import Link from 'next/link';
import firebase from '../../firebase/firebase';

import DeleteIcon from '@material-ui/icons/Delete';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function DraftQuotesList({ rows, menuClicked, handleSelected }) {
  const classes = useStyles();

  // const { status, data: rows } = useQuery(
  //     'projects',
  //     getAllProjects
  //     // getProjects
  // );

  // if (status === 'loading') return <p>Loading...</p>;
  // if (status === 'error') return <p>Error</p>;
  const handleClick = (id, campaign) => {
    // update campaigns click even if offer available
    if (campaign) {
      const ref = firebase.firestore().collection('specs');
      ref
        .doc(id)
        .update({
          'campaigns.isClicked': true,
        })
        .then(() => {
          menuClicked('quoteDetail');
          handleSelected(id);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      menuClicked('quoteDetail');
      handleSelected(id);
    }
  };

  return (
    <div>
      {/* <Container maxWidth="lg"> */}
      <Grid
        container
        spacing={3}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Quote ID</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Leadtime</TableCell>
                  <TableCell>Classification</TableCell>
                  <TableCell>Material</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows &&
                  rows.map((row, key) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        <Badge
                          badgeContent={
                            row.campaigns ? 'offer available' : null
                          }
                          color="primary"
                        >
                          {row.id}
                        </Badge>
                      </TableCell>

                      <TableCell align="right">{row.createdDate}</TableCell>

                      <TableCell align="right">{row.quantity}</TableCell>

                      <TableCell>{row.price}</TableCell>

                      <TableCell>{row.leadtime}</TableCell>
                      <TableCell>{row.classification}</TableCell>
                      <TableCell>{row.material}</TableCell>
                      <TableCell>
                        <OpenInBrowserIcon
                          onClick={() => handleClick(row.id, row.campaigns)}
                          color="secondary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* </Container> */}
    </div>
  );
}
