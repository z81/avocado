/* eslint-disable no-restricted-globals */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import 'fontsource-roboto';
import { MainPage } from '../../pages/main/main-page';
import { TvShow } from '../../pages/tv-show/tv-show';
import { SettingsPage } from '../../pages/settings/settings-page';
import { Watch } from '../../pages/watch/watch';

export const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route key="view" path="/view/tv-show/" component={TvShow} />
          <Route key="settings" path="/settings" component={SettingsPage} />
          <Route key="watch" path="/watch" component={Watch} />
          <Route key="main" path="/" component={MainPage} />
        </Switch>
      </Router>
    </div>
  );
};
