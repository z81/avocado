import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'effector-react';
import { useTitle } from '../../hooks/useTitle';
import { Layout } from '../../components/layout/Layout';
import { $settingsStore, setSettings } from '../../stores/settingsStore';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RutrackerApi = require('rutracker-api');

const rutracker = new RutrackerApi();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export const SettingsPage: React.FC = observer(() => {
  const classes = useStyles();
  const settings = useStore($settingsStore);
  useTitle('Настройки');

  const testRutrackerAuth = useCallback(async () => {
    try {
      const q = await rutracker.login({
        username: settings.rutrackerLogin,
        password: settings.rutrackerPassword,
      });
      console.log('ok', q, settings);
    } catch (e) {
      console.error(e, settings);
    }
  }, [settings]);

  const getInputProps = (prop: keyof typeof settings) => ({
    onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSettings({
        ...settings,
        [prop]: e.currentTarget.value,
      });
    },
  });

  return (
    <Layout>
      <Typography variant="h5">Rutracker</Typography>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          label="Login"
          value={settings.rutrackerLogin}
          inputProps={getInputProps('rutrackerLogin')}
        />
        <TextField
          type="password"
          label="Password"
          value={settings.rutrackerPassword}
          inputProps={getInputProps('rutrackerPassword')}
        />
        <Button onClick={testRutrackerAuth}>test</Button>
      </form>
    </Layout>
  );
});
