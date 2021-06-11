import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Container,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { useStore } from 'effector-react';
import { useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { $pageTitle } from '../../stores/pageTitleStore';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const Layout: React.FC = observer(({ children }) => {
  const classes = useStyles();
  const state = useLocation();
  const history = useHistory();
  const title = useStore($pageTitle);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {!state.pathname.endsWith('.html') ? (
            <IconButton
              edge="start"
              className={classes.backButton}
              color="inherit"
              aria-label="menu"
              onClick={() => history.goBack()}
            >
              <ArrowBack />
            </IconButton>
          ) : null}
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          {/* {!state.pathname.includes('settings') ? (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => history.push('/settings')}
            >
              <Settings />
            </IconButton>
          ) : null} */}
        </Toolbar>
      </AppBar>
      <Container component="main">
        <div>{children}</div>
      </Container>
    </>
  );
});
