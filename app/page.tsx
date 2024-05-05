"use client";

import { AppShell, Burger, Group, ScrollArea, Text, Title, MantineProvider } from '@mantine/core';
import ClipTimeline from './clipTimeline';
import StreamSelect from './streamSelect';
import ClipPlayer from './clipPlayer';
import Login from './login';
import { useEffect, useState } from "react"
import { StaticAuthProvider } from '@twurple/auth';
import { HelixVideo, HelixClip, ApiClient } from '@twurple/api';

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
  
  const [accessToken, setAccessToken] = useState("")
  const [video, setVideo] = useState<HelixVideo | null>(null)
  const [clip, setClip] = useState<HelixClip | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('StreamRecap2000#authToken');
    setAccessToken(accessToken || '');
  }, [])

  if (!accessToken) {
    return (<Login clientId={clientId}/>)
  }

  const authProvider = new StaticAuthProvider(clientId, accessToken);
  const apiClient = new ApiClient({ authProvider });

  if (!apiClient) {
    return "";
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

  return (
    <MantineProvider defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm' }}
        padding="md"
        layout="alt"
      >
        <AppShell.Header p="lg">
          <Title order={2}>{video ? video.title : ''}</Title>
        </AppShell.Header>
        <AppShell.Navbar p="md" >
          <ScrollArea>
            {video ? <ClipTimeline apiClient={apiClient} unselectVideo={unselectVideo} selectClip={selectClip} video={video}/> : <StreamSelect apiClient={apiClient} selectVideo={selectVideo}/>}
          </ScrollArea>
        </AppShell.Navbar>
        <AppShell.Main>{(video && clip) ? <ClipPlayer clip={clip}/> : ''}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}