import React from 'react'
import Header from '../component/Header';
import Main from '../component/Main';


const  Home =()=> {
    return (
      <div className='mainPage'>
        <Header/>
        <main>
          <Main/>
        </main>
        {/* Make the main page output here */}
      </div>
    )
}

export default Home;
