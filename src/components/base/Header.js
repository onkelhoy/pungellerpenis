import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import './hamburger.css'
import './base.scss'

export default class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hamburger: ''
    }

    this.hamburgerClick = this.hamburgerClick.bind(this)
  } 

  hamburgerClick (e) {
    this.setState({hamburger: this.state.hamburger === '' ? 'is-active' : ''})
  }

  render () {
    return (
      <header className={this.state.hamburger}>
        <button onClick={this.hamburgerClick} className={"hamburger hamburger--elastic " + this.state.hamburger} 
            aria-label="Menu" aria-controls="navigation" type="button">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>

        <nav id="navigation">
          <Link onClick={this.hamburgerClick} to="/">Home</Link> <br/>
          <Link onClick={this.hamburgerClick} to="/login">Login</Link>
        </nav>
      </header>
    );
  } 
}

