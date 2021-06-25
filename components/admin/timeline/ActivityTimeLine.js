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
import {
  getActivityByQuoteId,
  getAllActivity,
} from '../../../pages/api/getSpec';
import moment from 'moment';

export default function ActivityTimeLine({ quote }) {
  // console.log(quote);
  const { data, isLoading, isError } = useQuery(
    ['activityLog', quote.id],
    getActivityByQuoteId,
  );

  if (isLoading) return '...loading';
  if (isError) return '...error';

  // console.log(data);

  // const groupArrayByDate = (arr) => [
  //   ...new Set(
  //     arr.map((e) => moment(e.date.toDate()).format('DD/MM/yyyy HH:mm')),
  //   ),
  // ];
  // const grouped = groupArrayByDate(data).sort().reverse();
  // console.log(grouped);

  data.sort((a, b) => a.date - b.date);

  console.log(data);

  return (
    <React.Fragment>
      <Timeline align="alternate">
        {data &&
          data.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineOppositeContent>
                <Typography color="textSecondary">
                  {moment(item.date.toDate()).format('DD/MM/yyyy HH:mm')}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography>{item.title}</Typography>
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
