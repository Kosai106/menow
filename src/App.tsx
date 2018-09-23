import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { ProfilePage } from './pages/ProfilePage';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route path='/:username' component={ProfilePage} />
      </BrowserRouter>
    );
  }
}

export default App;
