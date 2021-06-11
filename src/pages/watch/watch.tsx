import { makeStyles } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'effector-react';

import { useTitle } from '../../hooks/useTitle';
import { $selectedTvShow } from '../../stores/selectedTvShowStore';
import { Layout } from '../../components/layout/Layout';
import { $tvShowSources } from '../../stores/tvShowSources';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

export const Watch: React.FC = observer(() => {
  const classes = useStyles();
  const tvShow = useStore($selectedTvShow);
  const sources = useStore($tvShowSources);
  useTitle(tvShow?.title ?? '');

  console.log(sources);

  return (
    <Layout>
      <div>{tvShow?.title}</div>
    </Layout>
  );
});
