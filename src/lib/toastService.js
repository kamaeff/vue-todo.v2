import {toast} from 'vue3-toastify';

export const isDark = () =>
  window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;

export const notification = (message, type) => {
  toast(message, {
    theme: isDark(),
    type,
    autoClose: 1500,
    dangerouslyHTMLString: true,
    position: 'bottom-right',
  });
};
