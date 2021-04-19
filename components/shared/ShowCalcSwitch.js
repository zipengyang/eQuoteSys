import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchLabels() {
  const [state, setState] = React.useState({
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={state.checkedB}
          onChange={handleChange}
          name="checkedB"
          color="primary"
        />
      }
      label="Show Calculation -- for testing use"
    />
  );
}
