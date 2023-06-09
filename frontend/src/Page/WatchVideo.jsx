import React, { useState } from 'react';
import { render } from 'react-dom';
import Videojs from './video.js';

// Mainからそれぞれの値を持ってくる
const WatchVideo = () => {
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [videoImg, setVideoImg] = useState();
    const [videoUrl, setVideoUrl] = useState();
    const [profileImg, setProfileImg] = useState();
    const [name, setName] = useState();

    const videoJsOptions = {
        autoplay: false,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        width: 720,
        height: 300,
        controls: true,
        sources: [
          {
            src: {videoUrl},
            type: 'video/mp4',
          },
        ],
      };
    return(
        <videojs>
            {videoJsOptions}
        </videojs>
    )
}

export default WatchVideo;
