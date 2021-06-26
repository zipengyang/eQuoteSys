import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Button, Grid, MenuItem, Select } from '@material-ui/core';

export default function ActionForm({ onSubmit, status, prices }) {
  const { register, handleSubmit, control, watch } = useForm();
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <label>Action:</label>
          </Grid>
          <Grid item xs={3}>
            <Controller
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="amended">Amended</MenuItem>
                  <MenuItem value="proforma">Proforma</MenuItem>
                </Select>
              )}
              name="status"
              disabled={status === 'quoted'}
              defaultValue={prices.status === 'undefined' ? '' : prices.status}
              control={control}
            />
          </Grid>
          {watch('status') === 'amended' && (
            <>
              <Grid item xs={3}>
                <label>Amended Price</label>
              </Grid>
              <Grid item xs={3}>
                <Controller
                  render={({ field }) => <TextField {...field} />}
                  name="amendedPrice"
                  control={control}
                  defaultValue={prices.amendedPrice}
                  disabled={status === 'updated'}
                />
              </Grid>
            </>
          )}
          <Grid item xs={2}>
            <Button
              variant="contained"
              type="submit"
              disabled={status !== 'submitted'}
            >
              confirm
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
