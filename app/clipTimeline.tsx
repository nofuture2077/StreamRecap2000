import * as _ from 'underscore';
import { Timeline, Text, Card, Space, Group, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { HelixClip, ApiClient, HelixVideo } from '@twurple/api';
import { IconArrowBack } from '@tabler/icons-react';

export default function ClipTimeline(props: {apiClient: ApiClient, video: HelixVideo, unselectVideo: () => void, selectClip: (clip: HelixClip) => void }) {
  const [clips, setClips ] = useState<HelixClip[]>([])
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    var date = props.video.creationDate;
    date.setHours(0, 0, 0, 0);

    var startOfCurrentDay = date.toISOString();
    date.setDate(date.getDate() + 1);
    var startOfNextDay = date.toISOString();

    props.apiClient.clips.getClipsForBroadcasterPaginated(props.video.userId, {
        startDate: startOfCurrentDay,
        endDate: startOfNextDay,
    }).getAll()
      .then((clips: HelixClip[]) => {
        setClips(clips)
        setLoading(false)
      })
  }, [props.video.userId, props.video.creationDate, props.video.userId, props.apiClient.clips])
 
  if (isLoading) return <p>Loading...</p>
  if (!clips.length) return <p>No clips</p>
  
  const filtered: HelixClip[] = clips.filter(
    (x) => x.title.indexOf(props.video.title) === -1
  );

  const data = _.groupBy<HelixClip[]>(
    clips,
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
              <>
                <Card key={index} padding="sm" component="a" onClick={() => {
                  props.selectClip(clip);
                }}>
                
                  <Text fw={50} size="m" c="cyan" lineClamp={1}>{clip.title}</Text>

                  <Group justify="space-between">
                    <Text size="xs" c="orange" mt={4}>{clip.creatorDisplayName} - {Math.floor(clip.duration).toString()}s</Text>
                  </Group>
                </Card>
                <Space h="md" />
              </>
            ))}
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
}
