import {toast} from 'vue3-toastify';

export const notification = (message, type) => {
  toast(message, {
    theme: 'dark',
    type,
    autoClose: 1500,
    dangerouslyHTMLString: true,
    position: 'bottom-right',
  });
};
