import {createApp} from 'vue';
import {createPinia} from 'pinia';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue3-toastify/dist/index.css';

import App from './App.vue';
import router from './routes/routes.js';
import './assets/styles.css';

const app = createApp(App);

app.component('VueDatePicker', VueDatePicker);

app.use(createPinia());
app.use(router);

app.mount('#app');
