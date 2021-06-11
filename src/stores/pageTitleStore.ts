import { createStore, createEvent } from 'effector';

export const setTitle = createEvent<string>();
export const $pageTitle = createStore('').on(setTitle, (_, title) => title);
