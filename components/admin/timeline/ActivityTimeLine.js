import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import { useQuery } from 'react-query';
import { getTimelineLogByQuoteId } from '../../../pages/api/getSpec';
import moment from 'moment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PhoneIcon from '@material-ui/icons/Phone';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';

export default function ActivityTimeLine({ quote }) {
  // console.log(quote);
  const { data, isLoading, isError } = useQuery(
    ['timelineLog', quote.id],
    getTimelineLogByQuoteId,
  );

  if (isLoading) return '...loading';
  if (isError) return '...error';

  data.sort((a, b) => a.date - b.date);

  return (
    <React.Fragment>
      <Timeline align="alternate">
        {data &&
          data.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineOppositeContent>
                <Typography color="textSecondary">
                  {moment(item.date.toDate()).format('DD/MM/yy HH:mm')}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography>
                  {item.type === 'email' ? (
                    <MailOutlineIcon fontSize="small" />
                  ) : item.type === 'Quote' ? (
                    <AssignmentIcon fontSize="small" />
                  ) : item.type === 'call' ? (
                    <PhoneIcon />
                  ) : item.type === 'meeting' ? (
                    <SupervisorAccountIcon />
                  ) : item.type === 'task' ? (
                    <AssignmentIndIcon />
                  ) : (
                    <SpeakerNotesIcon />
                  )}
                  {item.type === 'task'
                    ? `${item.title} assign to: ${item.assignedTo}`
                    : item.title}
                </Typography>
                {item.type === 'email' ? item.content : ''}
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
    </React.Fragment>
  );
}
