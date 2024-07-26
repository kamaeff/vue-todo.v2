<script setup>
import draggable from 'vuedraggable';
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {Plus, SquareCheckBig, TriangleAlert, X} from 'lucide-vue-next';

import MainForm from '@/views/Home/main/components/MainForm.vue';
import {notification} from '@/lib/toastService.js';
import {useUserStore} from '@/store/user.js';
import {TaskButtons, TaskFormGroup, TaskTitle} from '@/shared/tasks/tasks.js';

const drag = ref(false);
const userStore = useUserStore();
const _tasks = ref([]);
const isEdit = ref({});
const addData = ref(false);

const error = ref(false);

onMounted(() => {
  userStore.loadUser();
});

watch(
  () => userStore.tasks,
  tasks => {
    _tasks.value = tasks.map(task => ({
      ...task,
      status: task.status || 'new',
    }));
  },
  {immediate: true},
);

const openModalAdd = () => {
  if (userStore.token.length === 0) {
    error.value = true;
    notification('Please login first', 'warning', 3000);

    const timeout = setTimeout(() => {
      error.value = false;
    }, 500);

    return () => clearTimeout(timeout);
  }

  addData.value = true;
};

const closeModal = () => {
  addData.value = false;
};

const sortByPriority = (a, b) => {
  const priorityOrder = {A: 1, B: 2, C: 3};
  return priorityOrder[a.priority] - priorityOrder[b.priority];
};

const columns = computed(() => ({
  new: _tasks.value.filter(task => task.status === 'new').sort(sortByPriority),
  inProgress: _tasks.value
    .filter(task => task.status === 'inProgress')
    .sort(sortByPriority),
  done: _tasks.value
    .filter(task => task.status === 'done')
    .sort(sortByPriority),
}));

const updateTaskStatus = (columnName, evt) => {
  if (evt.added) {
    const movedItemId = evt.added.element.id;
    const movedItem = _tasks.value.find(task => task.id === movedItemId);
    if (movedItem) {
      movedItem.status = columnName;
      _tasks.value = [..._tasks.value];

      userStore.updateTask(movedItemId, movedItem);

      if (movedItem.status === 'done')
        notification('Gratz! Task completed', 'success', 1500);
    }
  }
};

const addTask = newTask => {
  _tasks.value.push(newTask);
  userStore.addTask(newTask);

  addData.value = false;
};

const deleteTask = async id => {
  const success = await userStore.removeTask(id);

  if (success) {
    _tasks.value = _tasks.value.filter(task => task.id !== id);
    notification('Task deleted successfully', 'success', 1500);
  } else {
    notification('Failed to delete task', 'warning', 1500);
  }
};

const editTask = id => {
  isEdit.value[id] = true;
};

const saveTask = (id, newSubtext) => {
  isEdit.value[id] = false;

  const taskIndex = _tasks.value.findIndex(task => task.id === id);
  if (taskIndex !== -1 && newSubtext.length > 0) {
    const task = _tasks.value[taskIndex];
    _tasks.value[taskIndex].subtext = newSubtext;
    userStore.updateTask(id, _tasks.value[taskIndex]);

    notification(`Task ${task.taskTitle} was saved`, 'success', 1500);
  } else {
    notification(`Task wasn't saved`, 'warning', 1500);
  }
};

const autoResizeTextarea = event => {
  const textarea = event.target;
  textarea.style.height = '100%';
  textarea.style.height = textarea.scrollHeight + 'px';
};

nextTick(() => {
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', autoResizeTextarea);
  });
});

const isAnyTaskInEditMode = computed(() =>
  Object.values(isEdit.value).includes(true),
);
</script>

<template>
  <div v-if="addData" class="overlay" @click="closeModal"></div>
  <div class="main">
    <Transition name="left">
      <MainForm
        v-show="addData"
        title="#addTask"
        @close="closeModal"
        @add-task="addTask"
      />
    </Transition>

    <div class="list">
      <div class="column new">
        <div class="header">
          <p>
            <X :size="16" color="red" />
            #TODO
          </p>
          <button type="button" @click="openModalAdd" :class="{shake: error}">
            <Plus :size="18" />
          </button>
        </div>

        <div class="content">
          <draggable
            v-model="columns.new"
            :disabled="isAnyTaskInEditMode"
            class="drag"
            group="tasks"
            item-key="id"
            @change="event => updateTaskStatus('new', event)"
            @start="drag = true"
          >
            <template #item="{element}">
              <div :key="element.id" :data-id="element.id" class="item">
                <TaskTitle :element="element" />

                <TaskFormGroup
                  :isEdit="isEdit[element.id]"
                  :subtext="element.subtext"
                  @update:subtext="element.subtext = $event"
                />

                <TaskButtons
                  :isEdit="isEdit[element.id]"
                  @edit-task="editTask(element.id)"
                  @save-task="saveTask(element.id, element.subtext)"
                  @delete-task="deleteTask(element.id)"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column inProgress">
        <div class="header">
          <p>
            <TriangleAlert :size="16" color="yellow" />
            #In Progress
          </p>
        </div>
        <div class="content">
          <draggable
            v-model="columns.inProgress"
            :disabled="isAnyTaskInEditMode"
            class="drag"
            group="tasks"
            item-key="id"
            @change="event => updateTaskStatus('inProgress', event)"
            @start="drag = true"
          >
            <template #item="{element}">
              <div :key="element.id" :data-id="element.id" class="item">
                <TaskTitle :element="element" />

                <TaskFormGroup
                  :isEdit="isEdit[element.id]"
                  :subtext="element.subtext"
                  @update:subtext="element.subtext = $event"
                />

                <TaskButtons
                  :isEdit="isEdit[element.id]"
                  @edit-task="editTask(element.id)"
                  @save-task="saveTask(element.id, element.subtext)"
                  @delete-task="deleteTask(element.id)"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column done">
        <div class="header">
          <p>
            <SquareCheckBig :size="16" color="green" />
            #Done
          </p>
        </div>

        <div class="content">
          <draggable
            v-model="columns.done"
            :disabled="isAnyTaskInEditMode"
            class="drag"
            group="tasks"
            item-key="id"
            @change="event => updateTaskStatus('done', event)"
            @start="drag = true"
          >
            <template #item="{element}">
              <div :key="element.id" :data-id="element.id" class="item">
                <TaskTitle :element="element" />

                <TaskButtons
                  :hiddenSave="true"
                  :isEdit="isEdit[element.id]"
                  @edit-task="editTask(element.id)"
                  @save-task="saveTask(element.id, element.subtext)"
                  @delete-task="deleteTask(element.id)"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'main.css';
</style>
