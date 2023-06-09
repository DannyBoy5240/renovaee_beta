import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
// import { getAuthClient } from "@dfinity/auth-client";



function BackHeader(){
    const navigate = useNavigate();
    const [drawerOpened, setDrawerOpened] = useState(false);

    // async function logout() {
    //   let authClient = await getAuthClient();
    //   if(authClient != null){
    //     await authClient.logout();
    //   }
    // }

    return (
      <div>
        <header>
          <div style=
          {{display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '30px'}}>
          <div className='backButton' onClick={() => navigate('/login_home')}>
          <KeyboardBackspaceIcon style={{width: '50px', height: '40px', color: '#9431CB'}}></KeyboardBackspaceIcon>
          </div>
          <div className='item'>
          <MenuIcon style={{width: '50px', height: '50px', color: '#9431CB'}} 
          onClick={() => setDrawerOpened(true)}/>
          </div>
          <Drawer
            anchor={'right'}
            open={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            PaperProps={{ style: { width: '200px' , height: '250px'} }}>
            <div className='menu-index'>
              <a href="#service" className='service' >likeVideo</a>
              <Link to ='/'
               >logout</Link>
            </div>
        </Drawer>
          </div>
        
        </header>
      </div>
    )
}

export default BackHeader;
