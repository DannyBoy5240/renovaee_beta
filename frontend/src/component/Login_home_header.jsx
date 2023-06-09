import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import logo from '../../assets/My project-4.png'
import { ProfileImg } from '../Page/MyProfilePage';
import defaultImg from '../../assets/profileIcon.jpeg'
import { greetUser} from '../api';
import {initializeIndexClient, initializeHelloServiceClient } from '../client';

function Login_home_header (){

  const isLocal = true;
  const indexClient = initializeIndexClient(isLocal);
  const helloServiceClient = initializeHelloServiceClient(isLocal, indexClient);
  const userId = "1"
  const navigate = useNavigate();
  // const imgFile = useContext(ProfileImg);
  const [greetImg, setGreetImg] = useState("");

  useEffect(() => {
    async function getUserGreeting() {
      if (userId === "") {
        let errorText = "must enter a name to try to greet";
        console.error(errorText);
        alert(errorText);
      } else {
        let greeting = await greetUser(helloServiceClient, userId)
        const result = greeting.split('#');
        setGreetImg(result[3]);
      }
    }
    getUserGreeting();
  }, [userId]);

    return (
      <header>
        <div className="header"
    style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '23px' 
      }}>
      <Link to='/login_home'>
        <img src={logo} className='logo' alt='Renovaee' 
        style={{width: '150px'}}></img>
      </Link>
      <div className="search" >
        <input type="text" className='search_input' placeholder="Search"/>
        <button type="submit">Search</button>
      </div>
      <div className='menu'>
      <div className='menu-1' style={{paddingRight: '33px'}}>
          <img className='menu_img' 
          src={greetImg} alt="Profile Image" 
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          onClick={() => {
            navigate('/my_profile')
          }} />
        </div>
        <div className='menu-2'>
          <VideoCallIcon 
          style={{color: '#9431CB', width: '60px', height: '50px'}}
          onClick={() => navigate('/upload')}></VideoCallIcon>
        </div>
      </div>
    </div>
      </header>
    )
}

export default Login_home_header;