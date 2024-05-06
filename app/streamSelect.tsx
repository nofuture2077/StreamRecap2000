import * as _ from 'underscore';
import { Timeline, Text, Card, Space, Select } from '@mantine/core';
import { ApiClient, HelixVideo } from '@twurple/api';
import { useEffect, useState } from 'react';

function formatDate(date: Date): string {
  let day: string | number = date.getDate();
  let month: string | number = date.getMonth() + 1;
  const year: number = date.getFullYear();

  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return day + '.' + month + '.' + year;
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  
  return `${paddedHours}h ${paddedMinutes}m`;
}

export default function StreamSelect(props: {apiClient: ApiClient, selectVideo: (video: HelixVideo) => void, channelId: number, setChannelId: (channelId:number) => void}) {
  const [videos, setVideos] = useState<HelixVideo[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    console.log('ChannelId: ' + props.channelId);
    props.apiClient.videos.getVideosByUser(props.channelId, {

    }).then((videos) => {
      setVideos(videos.data)
      setLoading(false)
    });
  }, [props.apiClient.videos, props.channelId]);
  
  if (isLoading) return <p>Loading...</p>
  if (!videos.length) return <p>No streams</p>

  return (
    <>
      <Select
        data={[
          { value: '531019578', label: 'ronnyberger' },
          { value: '451635946', label: 'daefoxi' },
          { value: '427135151', label: 'einsebastian' },
          { value: '529112648', label: 'knirpz' },
          { value: '147118536', label: 'zeusspezial' },
          { value: '90631404', label: 'mystery_blue' },
        ]}
        value={props.channelId.toString()}
        onChange={(_value, option) => props.setChannelId(parseInt(option.value))}
      />
      <Space h="lg"/>
      <Timeline bulletSize={24} lineWidth={2} align="left">
        {videos.map((video) => (
          <Timeline.Item key={video.id} title={formatDate(video.creationDate)} c="dimmed">
              <>
                <Card key={video.id} padding="sm" component="a" href="#" onClick={() => {
                  props.selectVideo(video);
                }}>
                <Text fw={600} size="m" c="cyan" lineClamp={1}>{video.title}</Text>
                  <Text fw={50} size="s" c="orange" lineClamp={1}>{video.userDisplayName} - {formatSeconds(video.durationInSeconds)}</Text>
                </Card>
                <Space h="md" />
              </>
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
}
