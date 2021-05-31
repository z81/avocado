import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import 'fontsource-roboto';
import { MainPage } from '../../pages/main/main-page';
import { TvShow } from '../../pages/tv-show/tv-show';

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/view/tv-show/" component={TvShow} />
        <Route path="/" component={MainPage} />
      </Switch>
    </Router>
  );
};
