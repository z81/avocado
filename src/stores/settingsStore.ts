import { createStore, createEvent } from 'effector';

type Settings = {
  rutrackerLogin: string;
  rutrackerPassword: string;
};

const defaultSettings: Settings = JSON.parse(
  localStorage.settings ?? 'null'
) || {
  rutrackerLogin: '',
  rutrackerPassword: '',
};

export const setSettings = createEvent<Settings>();
export const $settingsStore = createStore(defaultSettings).on(
  setSettings,
  (_, settings) => settings
);

$settingsStore.watch((state) => {
  localStorage.settings = JSON.stringify(state);
});
