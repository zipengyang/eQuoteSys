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
import Calc_Array from '../utils/panelisation';

export default function ConditionForm({ handleOnSubmit }) {
  const classes = useStyle();

  const { handleSubmit, watch, register, control } = useForm();
  const watchOperators = watch('operators');

  const onSubmit = async (data) => {
    await handleOnSubmit(data);
    // console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl} fullWidth>
              {/* <InputLabel htmlFor="AddCondition">Add Condition</InputLabel> */}
              <Select native name="operators" inputRef={register}>
                <option value="none">No condition</option>
                <option value="===">equal to</option>
                <option value="!==">not equal to</option>
                <option value=">">greater than</option>
                <option value=">=">greater than or equal to</option>
                <option value="<">less than</option>
                <option value="<=">less than or equal to</option>
                <option value="in">equall to any of the following</option>
                <option value="not-in">
                  not equal to any of the following
                </option>
              </Select>
            </FormControl>
          </Grid>
          {watchOperators !== 'none' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  required
                  id="conditionValue"
                  name="conditionValue"
                  label="Value"
                  fullWidth
                  autoComplete="conditionValue"
                  inputRef={register}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  //   color="primary"
                  type="submit"
                  className={classes.button}
                >
                  Add
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </form>
    </>
  );
}
