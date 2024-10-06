import * as _ from 'underscore';
import { Timeline, Text, Card, Space, Group, Button, Image } from '@mantine/core';
import { useEffect, useState } from 'react';
import { HelixClip, ApiClient, HelixVideo } from '@twurple/api';
import { IconArrowBack } from '@tabler/icons-react';

function formatViewCount(views: number) {
  if (views >= 1e6) {
      return (views / 1e6).toFixed(1) + 'M';
  } else if (views >= 1e3) {
      return (views / 1e3).toFixed(1) + 'K';
  } else {
      return views.toString();
  }
}

function getColor(views: number) {
  if (views >= 1e5) {
    return 'pink'
  } else if (views >= 1e4) {
    return 'grape';
  } else if (views >= 1e3) {
    return 'indigo';
  } else if (views >= 1e2) {
    return 'teal';
  }
  return '';
}

export default function AllClips(props: {apiClient: ApiClient }) {
  const [clips, setClips ] = useState<HelixClip[]>([])
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    props.apiClient.clips.getClipsForBroadcasterPaginated(451635946, {
        startDate: "2019-01-01T08:08:30.157Z",
        endDate: "2025-01-01T08:08:30.157Z",
    }).getAll()
      .then((clips: HelixClip[]) => {
        setClips(clips)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!clips.length) return (<>
      <p>No clips</p>
    </>)
  
  const data = _.groupBy<HelixClip[]>(
    clips,
    (clip: HelixClip) => Math.floor((clip.vodOffset || 0) / 60) + ''
  );

  return (
    <>
      <Space h="md"/>
      <Timeline bulletSize={24} lineWidth={2} align="left">
        {Object.keys(data).map((key) => (
          <Timeline.Item key={key} title={`Minute ${key}`} c="dimmed" bullet={data[key].length > 1 ? data[key].length : ' '}>
            {data[key].map((clip, index) => (
              <div key={clip.id}>
                <Card key={clip.thumbnailUrl} padding="sm" bg={getColor(clip.views)}>
                <Card.Section>
                  <Image
                    src={clip.thumbnailUrl}
                    height={272}
                    width={480}
                    alt="Norway"
                  />
                </Card.Section>
                  <Text fw={600} size="m" c="cyan" lineClamp={1}>{clip.title}</Text>

                  <Group justify="space-between">
                    <Text size="xs" c="orange" mt={4}>{clip.creatorDisplayName} - {formatViewCount(clip.views)} Views</Text>
                  </Group>
                </Card>
                <Space h="md" />
              </div>
            ))}
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
}
