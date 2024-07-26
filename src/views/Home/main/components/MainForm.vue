<script setup>
import {computed, onMounted, ref} from 'vue';
import {format, getDate, getMonth, getYear} from 'date-fns';

import {BarChartBig, Clipboard, X} from 'lucide-vue-next';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import {isDark, notification} from '@/lib/toastService.js';
import {useUserStore} from '@/store/user';

const userStore = useUserStore();

const emit = defineEmits(['add-task']);

const date = ref('');
const flow = ref(['month', 'year', 'calendar', 'time']);
const taskTitle = ref('');
const subtext = ref('');
const priority = ref('');
const maxChars = 500;

const shake = ref(false);

const minDate = computed(() => {
  const today = new Date();
  const month =
    getMonth(today) + 1 > 9 ? getMonth(today) + 1 : `0${getMonth(today) + 1}`;
  const day = getDate(today) > 9 ? getDate(today) : `0${getDate(today)}`;
  return `${getYear(today)}-${month}-${day}T00:00:00Z`;
});

const formatDate = date => {
  if (!date) return '';
  return format(date, 'dd.MM.yyyy HH:mm');
};

const closeModal = () => {
  emit('close');
};

const addTask = () => {
  const formattedDate = formatDate(date.value);
  const data = {
    date: String(formattedDate),
    priority: String(priority?.value || ''),
    title: String(taskTitle?.value || ''),
    subtext: String(subtext?.value || ''),
    status: 'new',
  };

  const dataToCheck = {...data};
  delete dataToCheck.date;

  const isAllFieldsFilled = Object.values(dataToCheck).every(
    value => value.trim() !== '',
  );

  if (!isAllFieldsFilled) {
    notification('Some fields are empty', 'warning', 1500);
    shake.value = true;

    const timeout = setTimeout(() => {
      shake.value = false;
    }, 500);

    return () => clearTimeout(timeout);
  }

  emit('add-task', data);

  notification('Task Added', 'success', 1500);

  taskTitle.value = '';
  subtext.value = '';
  priority.value = '';
  date.value = null;
};

onMounted(() => {
  userStore.loadUser();
});
</script>

<template>
  <form class="form" @submit.prevent="addTask">
    <button class="close" type="button" @click="closeModal">
      <X />
    </button>
    <div class="title">#Add Task</div>

    <VueDatePicker
      v-model="date"
      :dark="isDark()"
      :flow="flow"
      :min-date="minDate"
      auto-apply
      class="date"
      locale="ru"
      placeholder="#select a date"
    />

    <div class="container">
      <div class="priority">
        <BarChartBig :size="18" />

        <select v-model="priority">
          <option hidden value="">priority</option>
          <option value="C">❄️Low</option>
          <option value="B">⭐Medium</option>
          <option value="A">🔥High</option>
        </select>
      </div>

      <div class="input">
        <Clipboard :size="18" />

        <input
          v-model="taskTitle"
          placeholder="#add title"
          type="text"
          :maxlength="50"
        />
      </div>
    </div>

    <div class="textarea">
      <textarea
        v-model="subtext"
        placeholder="#add text for task"
        :maxlength="maxChars"
      ></textarea>
      <div :class="['char-count', {'red shake': subtext.length === maxChars}]">
        {{ subtext.length }} / {{ maxChars }}
        {{ subtext.length === maxChars ? 'limit reached' : '' }}
      </div>
    </div>

    <button :class="{shake: shake}" type="submit">#Add Task</button>
  </form>
</template>

<style scoped>
@import 'main-form.css';

.red {
  color: rgb(245, 92, 92) !important;
}
</style>
