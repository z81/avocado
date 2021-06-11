import { useEffect } from 'react';
import { setTitle } from '../stores/pageTitleStore';

export const useTitle = (title: string) => {
  useEffect(() => {
    setTitle(title);
    document.title = title;
  }, [title]);
};
