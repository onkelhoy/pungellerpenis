import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import './App.css';

import Login from './components/user/Login'
import Header from './components/base/Header'

library.add(faBars)

function App() {
  return (
    <Router>
      <Header />
      <Route path="/login" exact component={Login}></Route>
    </Router>
  );
}

export default App;
