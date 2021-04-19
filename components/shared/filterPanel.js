import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Chip } from '@material-ui/core';
import FilterChip from './filterChip';
import ConditionForm from './conditionForm';
import SelectedChipArray from './selectedChipArray';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function FilterPanel({ handleFilter }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [chips, setChips] = React.useState([]);
  const [condition, setCondition] = React.useState([]);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  let items = chips;
  const HandleAddChip = (chip) => {
    items.push(chip);
    setChips(items);

    setExpanded('conditions');
  };
  const handleOnSubmit = (data) => {
    // let items = [];
    data.field = chips[chips.length - 1];
    // items.push(data);
    setCondition([...condition, data]);
    console.log(condition);
    handleFilter(data);
    // console.log(data);
  };
  const handleClear = () => {
    setChips([]);
    setExpanded(false);
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'filters'}
        onChange={handleChange('filters')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filtersbh-content"
          id="filtersbh-header"
        >
          <Typography className={classes.heading}>Filter by field</Typography>
          {/* selected chips display here */}
          {chips.length === 0 ? (
            'Select field here'
          ) : (
            <SelectedChipArray chips={chips} />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <FilterChip HandleAddChip={HandleAddChip} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'conditions'}
        onChange={handleChange('conditions')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="conditionsbh-content"
          id="conditionsbh-header"
        >
          <Typography className={classes.heading}>Add condition</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {chips.length !== 0 && (
            <ConditionForm handleOnSubmit={handleOnSubmit} />
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'conditionsDisplay'}
        onChange={handleChange('conditionsDisplay')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="conditionsDisplay-content"
          id="conditionsDisplay-header"
        >
          <Typography className={classes.heading}>
            {' '}
            condition display here
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {condition.length === 0
            ? 'Select condition here'
            : condition.map((item) => (
                <p>
                  {item.field[0]}
                  {item.operators} {item.conditionValue}
                </p>
              ))}
        </AccordionDetails>
      </Accordion>
      <Button onClick={handleClear}>clear</Button>
      <Button>cancel</Button>
      <Button>apply</Button>
    </div>
  );
}
