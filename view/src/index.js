import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import {
  SignUpView,
  AboutView,
  LocationView,
  InterestView
} from './components/Views'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div id="view">
        <Switch>
          <Route exact path="/" component={SignUpView} />
          <Route exact path="/about" component={AboutView} />
          <Route exact path="/location" component={LocationView} />
          <Route exact path="/interest" component={InterestView} />
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)