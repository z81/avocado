import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import TheatersIcon from '@material-ui/icons/Theaters';
import React, { useEffect } from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { observer } from 'mobx-react-lite';
import { useStore } from 'effector-react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import { useTitle } from '../../hooks/useTitle';
import { $selectedTvShow } from '../../stores/selectedTvShowStore';
import { $tvShowSources, searchSources } from '../../stores/tvShowSources';
import { Layout } from '../../components/layout/Layout';

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
    width: 271,
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  row: {
    display: 'flex',
  },
}));

export const TvShow: React.FC = observer(() => {
  const classes = useStyles();
  const history = useHistory();
  const tvShow = useStore($selectedTvShow);
  const sources = useStore($tvShowSources);
  useTitle(tvShow?.title ?? '');

  useEffect(() => {
    if (sources.length > 0) {
      history.push('/watch');
    }
  }, [sources, history]);

  return (
    <Layout>
      <div>
        <div className={classes.row}>
          <div>
            <img
              className={classes.cover}
              src={tvShow?.fullPoster || tvShow?.poster}
              alt={tvShow?.title}
            />
          </div>

          <div>
            {tvShow?.seasons.map((s) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Сезон №{s.number}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <List component="nav" aria-label="main mailbox folders">
                      {s.episodes.map((e) => (
                        <ListItem
                          key={e.number}
                          button
                          onClick={() =>
                            searchSources({
                              title: tvShow?.title ?? '',
                              season: s.number,
                              episode: e.number,
                            })
                          }
                        >
                          №{e.number}
                          <ListItemIcon>
                            <TheatersIcon />
                          </ListItemIcon>
                          <ListItemText primary={`${e.title}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )) || null}
          </div>
        </div>
      </div>
    </Layout>
  );
});
