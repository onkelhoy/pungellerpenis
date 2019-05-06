import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css';

import Login from './components/user/Login'

function App() {
  return (
    <Router>

      <Route path="/login" exact component={Login}></Route>
    </Router>
  );
}

export default App;
