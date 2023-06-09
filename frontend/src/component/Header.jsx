import React, {useState,createContext} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import logo from '../../assets/My project-4.png'
import { AuthClient } from "@dfinity/auth-client";
import {useNavigate} from 'react-router-dom';
import { Actor } from "@dfinity/agent";
import MyProfilePage from '../Page/MyProfilePage';
// import Login_home_header from './Login_home_header';

export const UserId = createContext();

function Header() {
  
  const navigate = useNavigate();
  
  const [userId, setUserId] = useState(null);

  let authClient = null;

  async function init(){
      authClient = await AuthClient.create();
  }


  function handleSuccess(){
    navigate('/login_home')
     const principalId = authClient.getIdentity().getPrincipal().toText();
     setUserId(principalId);
      Actor.agentOf().replaceIdentity(
      authClient.getIdentity());
  }



  function login(){
    if (!authClient) throw new Error("AuthClient not initialized");

    const APP_NAME = "Litzi's Motoko Bootcamp";
    const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
    const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

    const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

    authClient.login({
      identityProvider,
      onSuccess: handleSuccess,
      windowOpenerFeatures: `
        left=${window.screen.width / 2 - 525 / 2},
        top=${window.screen.height / 2 - 705 / 2},
        toolbar=0,location=0,menubar=0,width=525,height=705
      `,
    });
  };
  init();




  return (
    <header>
      <div className="header"
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '30px'
          }}>
            <Link to='/'>
            <img src={logo} className='logo' alt='Renovaee' 
        style={{width: '150px'}}></img>
            </Link>
        
        <div className="search" >
          <input className='search_input' type="text" placeholder="Search"/>
          <button id="submit_auth" type="submit">Search</button>
        </div>
        <div className="account" id='login'>
          <UserId.Provider value={userId}>
          </UserId.Provider>
          <button style={{border: 'solid', borderColor: '#9431CB'}} 
          onClick={() => {
            // login()
            // console.log(userId)
            navigate('/login_home')
          }}
          >signIn/signUp</button>
        </div>
    </div>
    </header>
    
  );
}

export default Header;
