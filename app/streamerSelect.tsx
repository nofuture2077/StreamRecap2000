import * as _ from 'underscore';
import { Timeline, Text, Card, Space, Select, NavLink, Badge, Avatar, Group, Indicator, NumberFormatter, Tooltip } from '@mantine/core';
import { ApiClient, HelixVideo, HelixFollowedChannel, HelixChannel, HelixUser, HelixStream } from '@twurple/api';
import { useEffect, useState } from 'react';

export default function StreamSelect(props: {apiClient: ApiClient, userId: string}) {
  const [followedChannels, setFollowedChannel] = useState<HelixFollowedChannel[]>([]);
  const [users, setUsers] = useState<HelixUser[]>([]);
  const [streams, setStreams] = useState<HelixStream[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 60);
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    props.apiClient.channels.getFollowedChannelsPaginated(props.userId).getAll().then((followedChannels) => {
      const userids = followedChannels.map(x => x.broadcasterId);
      const requestUsers = _.chunk(userids, 100).map((chunk) => props.apiClient.users.getUsersByIds(chunk));
      const requestStreams = _.chunk(userids, 100).map((chunk) => props.apiClient.streams.getStreamsByUserIds(chunk));
      Promise.all(requestUsers).then((chunkResults) => {
          // @ts-ignore
          const users: HelixUser[] = _.flatten(chunkResults, 1);
          setUsers(users);
          setFollowedChannel(followedChannels);
          setLoading(false);
      });
      Promise.all(requestStreams).then((chunkResults) => {
        const streams: HelixStream[] = _.flatten(chunkResults, 1);
        setStreams(streams);
      });
    });
  }, [props.userId, seconds]);
  
  if (isLoading) return <p>Loading...</p>
  if (!followedChannels.length || !streams.length) return <p>No streams</p>

  const userIndex = _.indexBy(users, (u) => u.id);
  const streamIndex = _.indexBy(streams, (u) => u.userId);

  const groupedChannels = _.groupBy(followedChannels, (channel) => streamIndex[channel.broadcasterId] ? 'online' : 'offline');
  const onlineChannels = _.sortBy(groupedChannels.online, (channel) => (streamIndex[channel.broadcasterId] || {}).viewers || 0).reverse();
  const offlineChannels = groupedChannels.offline;
  return (
    <>
      <NavLink label="Online" childrenOffset={0} opened>
          {onlineChannels.map(x => 
            <Tooltip key={x.broadcasterId} label={(streamIndex[x.broadcasterId] || {}).title} multiline w={220} withArrow position="right" offset={5}>
                <NavLink
                href=""
                label={<Text fw={700}>{x.broadcasterDisplayName}</Text>}
                description={streamIndex[x.broadcasterId].gameName }
                leftSection={
                  <Avatar radius="xl" src={userIndex[x.broadcasterId].profilePictureUrl}/>
                }
                rightSection={
                  <Indicator position="middle-start" offset={-10} processing={true} color="red"><NumberFormatter value={(streamIndex[x.broadcasterId] || {}).viewers} thousandSeparator="." decimalSeparator="," /></Indicator>
                }
              />
            </Tooltip>
          )}
      </NavLink>
      <NavLink label="Offline">
          {offlineChannels.map(x => 
            <Tooltip key={x.broadcasterId} label="kommt bald wieder" multiline w={220} withArrow position="right" offset={5}>
                <NavLink
                href="#required-for-focus"
                label={<Text fw={700}>{x.broadcasterDisplayName}</Text>}
                description='Offline'
                leftSection={
                  <Avatar radius="xl" src={userIndex[x.broadcasterId].profilePictureUrl}/>
                }
              />
            </Tooltip>
          )}
      </NavLink>
    </>
  );
}
