import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container/Container';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'effector-react';
import { $selectedTvShow } from '../../stores/selectedTvShowStore';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export const TvShow: React.FC = observer(() => {
  const classes = useStyles();
  const tvShow = useStore($selectedTvShow);

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <div>
          <img
            className={classes.cover}
            src={tvShow?.fullPoster || tvShow?.poster}
            alt={tvShow?.title}
          />
        </div>
        <div>{tvShow?.title}</div>
      </div>
    </Container>
  );
});
