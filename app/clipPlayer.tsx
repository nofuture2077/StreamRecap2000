import { HelixClip } from '@twurple/api';

export default function ClipPlayer(props: {clip: HelixClip}) {
    console.log(props.clip);
    return (<iframe id="player" width="800" height="600" src={'https://player.twitch.tv/?video=' + props.clip.videoId + "&parent=" + encodeURI('nofuture2077.github.io')+ "&autoplay=true"} ></iframe>);
}