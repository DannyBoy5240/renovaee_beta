import * as React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Page/Home';
import Login_home from './Page/Login_home';
import MyProfilePage from './Page/MyProfilePage';
import UploadPage from './Page/UploadPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path={`/`} element={<Home/>} />
        <Route path={`/login_home`} element={<Login_home/>} />
        <Route path={`/my_profile`} element={<MyProfilePage/>} />
        <Route path={`/my_profile/:imgFile`} element={<MyProfilePage/>} />
        <Route path={`/upload`} element={<UploadPage/>} />
      </Routes>
    </Router>
  );
}


export default App;
