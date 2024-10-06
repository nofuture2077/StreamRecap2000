"use client";

import { Button } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function Login(props: {clientId: String}) {
    const [redirectUrl, setRedirectUrl] = useState<string | null>();

    useEffect(() => {
        const url = window.location.origin + window.location.pathname.replace("index.html", "");
        setRedirectUrl(encodeURI(url));
    }, []);

    var state = '';
    let scope = encodeURIComponent([
        'user:read:follows'
    ].join('+'));
    
    let responseType = encodeURIComponent('token');
    let authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=${responseType}&client_id=${props.clientId}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}`;

    return (<Button
            component="a"
            href={authUrl}
            rightSection={<IconLogin size={14} />}>    
            Login with Twitch
        </Button> );
  }