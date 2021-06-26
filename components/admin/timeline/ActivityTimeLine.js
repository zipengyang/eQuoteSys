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
                  ) : (
                    item.type
                  )}
                  {item.title}
                </Typography>
                {item.type === 'email' ? item.content : ''}
              </TimelineContent>
            </TimelineItem>
          ))}

        {/*         
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">10:00 am</Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>Code</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">12:00 am</Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>Sleep</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">9:00 am</Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>Repeat</Typography>
          </TimelineContent>
        </TimelineItem> */}
      </Timeline>
    </React.Fragment>
  );
}
