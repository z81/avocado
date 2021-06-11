import {
  CircularProgress,
  InputAdornment,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from 'effector-react';
import { observer } from 'mobx-react-lite';
import {
  $tvShowsLoadingStore,
  searchTvShow,
  TvShowsStore,
} from '../../stores/tvShowStore';
import {
  $selectedTvShow,
  getTvShowInfo as fetchTvShowInfo,
  selectTvShow,
} from '../../stores/selectedTvShowStore';
import { useTitle } from '../../hooks/useTitle';
import { Layout } from '../../components/layout/Layout';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    width: '100%',
  },
  searchInput: {},
  poster: {
    margin: theme.spacing(1),
  },
  preview: {
    height: '40px',
    objectFit: 'fill',
  },
}));

export const MainPage = observer(() => {
  useTitle('Поиск по названию');
  const classes = useStyles();
  const tvShows = useStore(TvShowsStore);
  const selectedTvShow = useStore($selectedTvShow);
  const isLoading = useStore($tvShowsLoadingStore);
  const history = useHistory();

  return (
    <Layout>
      <div className={classes.paper}>
        <Autocomplete
          className={classes.search}
          options={tvShows}
          autoHighlight
          value={selectedTvShow}
          filterOptions={(_) => _}
          onInputChange={(_, value) => {
            searchTvShow(value);
          }}
          onChange={(_, tvShow) => {
            selectTvShow(tvShow?.kinopoiskId ?? null);
            if (tvShow) {
              fetchTvShowInfo(tvShow);
            }
            history.push('/view/tv-show/');
          }}
          getOptionLabel={(option) => option.title}
          renderOption={(option) => (
            <>
              <img
                width={32}
                height={44}
                alt={option.title}
                src={option.poster}
                className={classes.poster}
              />
              <span>
                {option.title} ({option.year})
              </span>
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              className={classes.searchInput}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      className={classes.preview}
                      src={selectedTvShow?.poster}
                      alt=""
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {isLoading && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              label="Поиск по названию"
              variant="outlined"
            />
          )}
        />
      </div>
    </Layout>
  );
});
