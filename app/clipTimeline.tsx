import * as _ from 'underscore';
import { Timeline, Text, Card, Space, Group, Button } from '@mantine/core';
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

export default function ClipTimeline(props: {apiClient: ApiClient, video: HelixVideo, unselectVideo: () => void, selectClip: (clip: HelixClip) => void }) {
  const [clips, setClips ] = useState<HelixClip[]>([])
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    var date = props.video.creationDate;

    var startDate = date.toISOString();
    date.setTime(date.getTime() + (1000 * props.video.durationInSeconds));
    var endDate = date.toISOString();

    props.apiClient.clips.getClipsForBroadcasterPaginated(props.video.userId, {
        startDate,
        endDate,
    }).getAll()
      .then((clips: HelixClip[]) => {
        setClips(clips)
        setLoading(false)
      })
  }, [props.video.userId, props.video])
 
  if (isLoading) return <p>Loading...</p>
  if (!clips.length) return (<>
      <Button leftSection={<IconArrowBack size={14} />} variant="default" onClick={props.unselectVideo}>
        Back
      </Button>
      <Space h="md"/>
      <p>No clips</p>
    </>)
  
  const filtered: HelixClip[] = clips.filter(
    (x) => x.title.indexOf(props.video.title) === -1 && x.views > 3
  );

  const data = _.groupBy<HelixClip[]>(
    filtered,
    (clip: HelixClip) => Math.floor((clip.vodOffset || 0) / 60) + ''
  );

  return (
    <>
      <Button leftSection={<IconArrowBack size={14} />} variant="default" onClick={props.unselectVideo}>
        Back
      </Button>
      <Space h="md"/>
      <Timeline bulletSize={24} lineWidth={2} align="left">
        {Object.keys(data).map((key) => (
          <Timeline.Item key={key} title={`Minute ${key}`} c="dimmed" bullet={data[key].length > 1 ? data[key].length : ' '}>
            {data[key].map((clip, index) => (
              <div key={clip.id}>
                <Card key={clip.thumbnailUrl} padding="sm" bg={getColor(clip.views)} component="a" href="#" onClick={() => {
                  props.selectClip(clip);
                }}>
                
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
