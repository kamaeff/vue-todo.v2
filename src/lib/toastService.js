import {toast} from 'vue3-toastify';

export const isDark = () => {
  return window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
};

export const notification = (message, type, time) => {
  const theme = String(isDark());
  toast(message, {
    theme,
    type,
    autoClose: time,
    dangerouslyHTMLString: true,
    position: 'bottom-right',
  });
};
