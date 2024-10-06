"use client";

import { AppShell, Burger, Group, ScrollArea, Text, Title, MantineProvider } from '@mantine/core';
import ClipTimeline from './clipTimeline';
import StreamSelect from './streamSelect';
import StreamerSelect from './streamerSelect';
import ClipPlayer from './clipPlayer';
import AllClips from './allclips';
import Login from './login';
import { useEffect, useState } from "react"
import { StaticAuthProvider, AccessTokenMaybeWithUserId } from '@twurple/auth';
import { HelixVideo, HelixClip, ApiClient } from '@twurple/api';
import Logo from '../public/logo.svg';
import Image from 'next/image';

function getQueryVariable(query: String, variable: String) {
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
  console.log('Query variable %s not found', variable);
}

export default function TwitchRecap() {
  const clientId = '75agrccykaptlezbeekh44d7lw4tog';
  const origin = typeof window !== 'undefined' && window.location.hash
            ? window.location.hash.substring(1)
            : '';

  const token = origin ? getQueryVariable(origin, "access_token") : '';

  useEffect(() => {
      if (token) {
          localStorage.setItem('StreamRecap2000#authToken', token || '');
      }
  }, [token]);
  
  const [accessToken, setAccessToken] = useState<string>()
  const [apiClient, setApiClient] = useState<ApiClient>()
  const [userId, setUserId] = useState<string>()
  const [video, setVideo] = useState<HelixVideo | null>(null)
  const [clip, setClip] = useState<HelixClip | null>(null)
  const [channelId, setChannelId] = useState<number>(531019578)

  useEffect(() => {
    const accessToken = localStorage.getItem('StreamRecap2000#authToken');
    setAccessToken(accessToken || '');

    const authProvider = new StaticAuthProvider(clientId, accessToken || '');
    const apiClient = new ApiClient({ authProvider });
    
    authProvider.getAnyAccessToken().then((user: AccessTokenMaybeWithUserId) => {
      setUserId(user.userId);
      setApiClient(apiClient);
    });
  }, [token])

  if (!accessToken || !apiClient) {
    return (<Login clientId={clientId}/>)
  }

  const selectVideo = (video: HelixVideo) => {
    setVideo(video);
  };

  const unselectVideo = () => {
    setVideo(null);
    setClip(null);
  };

  const selectClip = (clip: HelixClip) => {
    setClip(clip);
  };

  if (!userId) {
    return "";
  }


  return (
    <MantineProvider defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm' }}
        padding="md"
        layout="default"
      >
        <AppShell.Header p="lg">
          {video ? <Title order={2}>{video.title}</Title> : (<Image priority src={Logo}alt="Rasselbande Logo" style={{height: "100%", width: "100%"}} />)}
        </AppShell.Header>
        <AppShell.Navbar>
          <ScrollArea>
            {video ? <ClipTimeline apiClient={apiClient} unselectVideo={unselectVideo} selectClip={selectClip} video={video}/> : <StreamSelect apiClient={apiClient} channelId={channelId} setChannelId={setChannelId} selectVideo={selectVideo}/>}
          </ScrollArea>
        </AppShell.Navbar>
        <AppShell.Main>{(video && clip) ? <ClipPlayer clip={clip}/> : ''}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

//
//AllClips apiClient={apiClient} />