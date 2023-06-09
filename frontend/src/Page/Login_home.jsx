import React, { Component } from 'react'
import Main from '../component/Main'
import Login_home_header from '../component/Login_home_header'

export default class Login_home extends Component {
  render() {
    return (
      <div>
        <header>
          <Login_home_header/>
        </header>
        <Main/>
      </div>
    )
  }
}
