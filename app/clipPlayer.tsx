import { HelixClip } from '@twurple/api';

export default function ClipPlayer(props: {clip: HelixClip}) {
    return (<video id="player" style={{width: '100%'}} controls={true} autoPlay={true} src={props.clip.thumbnailUrl.replaceAll("-preview-480x272.jpg", ".mp4")} ></video>);
}