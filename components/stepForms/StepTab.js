import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function StepTabs({ tabValue }) {
  return (
    <Paper square elevation={8}>
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        textColor="primary"
        aria-label="specification"
      >
        <Tab label="Dimension" disabled />
        <Tab label="Material" disabled />
        <Tab label="LeadTime" disabled />
      </Tabs>
    </Paper>
  );
}
