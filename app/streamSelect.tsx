import * as _ from 'underscore';
import { Timeline, Text, Card, Space,  } from '@mantine/core';
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
export default function StreamSelect(props: {apiClient: ApiClient, selectVideo: (video: HelixVideo) => void}) {
  const [videos, setVideos] = useState<HelixVideo[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    props.apiClient.videos.getVideosByUser(531019578, {

    }).then((videos) => {
      setVideos(videos.data)
      setLoading(false)
    });
  }, [props.apiClient.videos]);
  
  if (isLoading) return <p>Loading...</p>
  if (!videos.length) return <p>No streams</p>

  return (
    <>
      <Timeline bulletSize={24} lineWidth={2} align="left">
        {videos.map((video) => (
          <Timeline.Item key={video.id} title={formatDate(video.creationDate)} c="dimmed" component="a" onClick={() => {
            props.selectVideo(video);
          }}>
              <>
                <Card key={video.id} padding="sm">
                <Text fw={50} size="m" c="cyan" lineClamp={1}>{video.title}</Text>
                  <Text fw={50} size="s" c="orange" lineClamp={1}>{video.userDisplayName}</Text>
                </Card>
                <Space h="md" />
              </>
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
}
