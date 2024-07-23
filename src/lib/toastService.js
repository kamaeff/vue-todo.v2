import {toast} from 'vue3-toastify';

export const isDark = () => {
  return window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
};

export const notification = (message, type) => {
  const theme = String(isDark());
  toast(message, {
    theme,
    type,
    autoClose: 1500,
    dangerouslyHTMLString: true,
    position: 'bottom-right',
  });
};
