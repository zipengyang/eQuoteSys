import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function SelectedChipArray({ chips }) {
  const classes = useStyles();

  const [chipData, setChipData] = React.useState(chips);

  const handleDelete = (chipToDelete) => {
    const newChips = chipData.filter(
      (chip) => chip.key !== parseInt(chipToDelete),
    );
    setChipData(newChips);
  };

  return (
    <Paper component="ul" className={classes.root}>
      {chipData.map((data) => {
        let icon;

        if (data.label === 'React') {
          icon = <TagFacesIcon />;
        }

        return (
          <li key={data.key}>
            <Chip
              color="primary"
              icon={icon}
              label={data.label}
              // onDelete={data.label === 'React' ? undefined : handleDelete( data )}
              onDelete={() => handleDelete(data.key)}
              className={classes.chip}
            />
          </li>
        );
      })}
    </Paper>
  );
}
