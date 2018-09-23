import * as React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';

import { ProfilePage } from './pages/ProfilePage';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Route path='/:username' component={ProfilePage} />
      </BrowserRouter>
    );
  }
}

export default App;
