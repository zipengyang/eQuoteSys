import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { useSpecContext } from './SpecContext';
import { Typography, Avatar } from '@material-ui/core';

export default function SolderMaks() {
  // get state from context
  const { state, handleSpecChange } = useSpecContext();
  // update state by reducer
  const handleChange = (event) => {
    handleSpecChange(event.target.name, event.target.value);
  };

  // const handleChange = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">SoldermMask</FormLabel>
      <RadioGroup
        aria-label="SolderMask"
        name="soldermask"
        value={state.soldermask.value}
        onChange={handleChange}
      >
        <Grid container justify="flex-start">
          <Grid item xs={4}>
            <FormControlLabel
              value="green"
              control={<Radio disabled={state.activeStep.value > 0} />}
              label={
                <Grid
                  container
                  alignItems="center"
                  spacing={1}
                  justify="flex-start"
                >
                  <Grid item xs={10}>
                    <Typography>Green </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Avatar
                      variant="square"
                      style={{
                        color: 'green',
                        background: 'green',
                        height: '18px',
                        width: '18px',
                      }}
                    >
                      G
                    </Avatar>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              value="red"
              control={<Radio disabled={state.activeStep.value > 0} />}
              label={
                <Grid
                  container
                  justify="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs={10}>
                    <Typography>Red </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Avatar
                      variant="square"
                      style={{
                        color: 'red',
                        background: 'red',
                        height: '18px',
                        width: '18px',
                      }}
                    >
                      R
                    </Avatar>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              value="yellow"
              control={<Radio disabled={state.activeStep.value > 0} />}
              label={
                <Grid
                  container
                  justify="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs={10}>
                    <Typography>Yellow </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Avatar
                      variant="square"
                      style={{
                        color: 'yellow',
                        background: 'yellow',
                        height: '18px',
                        width: '18px',
                      }}
                    >
                      Y
                    </Avatar>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              value="blue"
              control={<Radio disabled={state.activeStep.value > 0} />}
              label={
                <Grid
                  container
                  justify="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs={10}>
                    <Typography>Blue </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Avatar
                      variant="square"
                      style={{
                        color: 'blue',
                        background: 'blue',
                        height: '18px',
                        width: '18px',
                      }}
                    >
                      R
                    </Avatar>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
          <FormControlLabel
            value="white"
            control={<Radio disabled={state.activeStep.value > 0} />}
            label={
              <Grid
                container
                justify="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={10}>
                  <Typography>White </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Avatar
                    variant="square"
                    style={{
                      color: 'white',
                      background: 'white',
                      height: '18px',
                      width: '18px',
                    }}
                  >
                    W
                  </Avatar>
                </Grid>
              </Grid>
            }
          />
        </Grid>
      </RadioGroup>
    </FormControl>
  );
}
