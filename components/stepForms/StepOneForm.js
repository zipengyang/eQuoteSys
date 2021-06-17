import React from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { Paper } from '@material-ui/core';
import { useStyle } from '../../src/styles';
import { Grid, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useAuth } from '../../firebase/auth';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GetPanel from '../utils/panelisation';

export default function StepOneForm({ defaultValues, handleOnSubmit }) {
  const classes = useStyle();
  const router = useRouter();
  const { quoteid, uid } = router.query;
  const { user } = useAuth();
  const userID = !user ? '' : user.email;
  const { handleSubmit, watch, register, control } = useForm({
    defaultValues,
  });
  const watchSuppliedAs = watch('suppliedAs');
  const watch_xout = watch('xout');
  const allFields = watch();

  const onSubmit = async (data) => {
    await handleOnSubmit(data);
    router.push(`/quote/${quoteid}/${uid}/0?tabValue=1`);
  };
  // switch
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  // panel calculation  -- will move to cloud function
  // const getPanel = () => {
  //   const num_1 = Calc_Array(watchPanType, allFields.width, allFields.length);
  //   const num_2 = Calc_Array(watchPanType, allFields.length, allFields.width);
  //   const best_cut = Math.max(num_1, num_2);
  //   return watchSuppliedAs === 'single'
  //     ? Math.ceil(allFields.quantity / best_cut)
  //     : Math.ceil(allFields.quantity / (best_cut * allFields.cstep));
  // };
  const watchPanType = watch('panType');
  const watchWidth = watch('width');
  const watchLength = watch('length');
  const bestCut = GetPanel(watchPanType, watchWidth, watchLength);
  const steps =
    watchSuppliedAs === 'single' ? bestCut : bestCut * allFields.cstep;
  const panels =
    watchSuppliedAs === 'single'
      ? Math.ceil(allFields.quantity / bestCut)
      : Math.ceil(allFields.quantity / (bestCut * allFields.cstep));

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Grid container spacing={3} xs={9} md={9}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="suppliedAs">Supplied As</InputLabel>
              <Select native name="suppliedAs" inputRef={register}>
                <option value="single">Single</option>
                <option value="array">Array</option>
              </Select>
            </FormControl>
          </Grid>
          {watchSuppliedAs === 'array' && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                required
                id="cstep"
                name="cstep"
                label="Circuits Per Array"
                fullWidth
                autoComplete="cstep"
                inputRef={register}
              />
            </Grid>
          )}
          {watchSuppliedAs === 'array' && (
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel htmlFor="xout">x_Out</InputLabel>

              <Controller
                name="xOut"
                control={control}
                render={(props) => (
                  <Checkbox
                    onChange={(e) => props.onChange(e.target.checked)}
                    checked={props.value}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              required
              id="width"
              name="width"
              label="Width"
              fullWidth
              autoComplete="width"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              required
              id="length"
              name="length"
              label="Length"
              fullWidth
              autoComplete="length"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              required
              id="quantity"
              name="quantity"
              label="Quantity"
              fullWidth
              autoComplete="quantity"
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl>
              <InputLabel htmlFor="panType">Panel Type</InputLabel>
              <Select native name="panType" inputRef={register}>
                <option value="1812">18 X 12</option>
                <option value="1824">18 X 24</option>
                <option value="2112">21 X 12</option>
                <option value="2124">21 X 24</option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
          >
            next
          </Button>
        </div>
      </form>
      {/* <Grid item xs={3} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={state.checkedB}
                onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="Show calculation (for testing use)"
          />

          {state.checkedB && <p>calculation display below:</p>}

          {state.checkedB && <h3>best cut -- steps: {steps}</h3>}
          {state.checkedB && <h3>panels: {panels}</h3>}
        </Grid> */}
    </>
  );
}
