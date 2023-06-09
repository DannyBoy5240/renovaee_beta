import React, {useState, useEffect} from 'react'
import {getVideo} from '../api';
import {initializeIndexClient, initializeVideoClient } from '../client';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


// 動画の一覧を表示する(Primary action)
function Main () {

  const videoId = "1";
  // const navigate = useNavigate();
  const isLocal = true;
  const indexClient = initializeIndexClient(isLocal);
  const videoClient = initializeVideoClient(isLocal, indexClient);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoImg, setVideoImg] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    async function fetchVideos() {
      if (videoId === "") {
        let errorText = "must enter a name to try to greet";
        console.error(errorText);
        alert(errorText);
      } else {
        let videos = await getVideo(videoClient, videoId);
        const result = videos.split('#');
        setTitle(result[1]);
        setDescription(result[2]);
        setVideoImg(result[3]);
        setVideoUrl(result[4]);
        console.log(videos);
      }
    }
    fetchVideos();
  }, [videoId]);



    return (
      <div>
        <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="500"
          image={videoImg}
          alt="videoImg"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
      </div>
    )
}

export default Main;