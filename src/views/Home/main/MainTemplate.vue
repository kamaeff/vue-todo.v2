<script setup>
import draggable from 'vuedraggable';
import {computed, onMounted, ref} from 'vue';
import {
  FilePenLine,
  SaveAll,
  SquareCheckBig,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-vue-next';

import MainForm from '@/views/Home/main/components/MainForm.vue';
import {notification} from '@/lib/toastService.js';
import {useUserStore} from '@/store/user.js';

const drag = ref(false);
const userStore = useUserStore();
const _tasks = ref([]);
const isEdit = ref({});

onMounted(() => {
  userStore.loadUser();
  setTimeout(() => {
    console.log(userStore.tasks);
    _tasks.value = userStore.tasks.map(task => ({
      ...task,
      status: task.status || 'new',
    }));
  }, 1000);
});

const getPriorityIcon = priority => {
  switch (priority) {
    case 'A':
      return '🔥';
    case 'B':
      return '⭐';
    case 'C':
      return '❄️';
    default:
      return '';
  }
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
        notification('Gratz! Task completed', 'success');
    }
  }
};

const addTask = newTask => {
  _tasks.value.push(newTask);
  userStore.addTask(newTask);
};

const deleteTask = id => {
  userStore.removeTask(id);

  _tasks.value = _tasks.value.filter(task => task.id !== id);
};

const editTask = id => {
  isEdit.value[id] = true;
};

const saveTask = (id, newSubtext) => {
  isEdit.value[id] = false;

  const taskIndex = _tasks.value.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    _tasks.value[taskIndex].subtext = newSubtext;
    userStore.updateTask(id, _tasks.value[taskIndex]);
  }
};
</script>

<template>
  <div class="main">
    <MainForm @add-task="addTask" />

    <div class="list">
      <div class="column new">
        <div class="header">
          <p class="title">
            <X :size="20" color="red" />
            #New
          </p>
        </div>
        <div class="content">
          <draggable
            v-model="columns.new"
            class="drag"
            group="tasks"
            item-key="id"
            @change="event => updateTaskStatus('new', event)"
            @start="drag = true"
          >
            <template #item="{element}">
              <div :key="element.id" :data-id="element.id" class="item">
                <div>
                  <h3>
                    {{ getPriorityIcon(element.priority) + element.taskTitle }}
                  </h3>
                  <span>({{ element.date }})</span>
                </div>

                <div class="form-group">
                  <label
                    :class="{'show-label': isEdit[element.id]}"
                    for="subtext"
                  >
                    Edit
                  </label>

                  <input
                    v-model="element.subtext"
                    :class="['edit-input', {isEdit: isEdit[element.id]}]"
                    :readonly="!isEdit"
                    :value="element.subtext"
                    name="subtext"
                    type="text"
                  />
                </div>

                <div class="btns">
                  <button
                    :class="{hide: isEdit[element.id]}"
                    title="#edit"
                    type="button"
                    @click="editTask(element.id)"
                  >
                    <FilePenLine :size="20" />
                  </button>

                  <button
                    :class="{hide: !isEdit[element.id]}"
                    title="#save"
                    type="button"
                    @click="saveTask(element.id, element.subtext)"
                  >
                    <SaveAll :size="20" />
                  </button>

                  <button
                    title="#delete"
                    type="button"
                    @click="deleteTask(element.id)"
                  >
                    <Trash2 :size="20" />
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column inProgress">
        <div class="header">
          <p class="title">
            <TriangleAlert :size="20" color="yellow" />
            #In Progress
          </p>
        </div>
        <div class="content">
          <draggable
            v-model="columns.inProgress"
            class="drag"
            group="tasks"
            item-key="id"
            @change="event => updateTaskStatus('inProgress', event)"
            @start="drag = true"
          >
            <template #item="{element}">
              <div :key="element.id" :data-id="element.id" class="item">
                <div>
                  <h3>
                    {{ getPriorityIcon(element.priority) + element.taskTitle }}
                  </h3>
                  <span>({{ element.date }})</span>
                </div>

                <div class="form-group">
                  <label
                    :class="{'show-label': isEdit[element.id]}"
                    for="subtext"
                  >
                    Edit
                  </label>

                  <input
                    v-model="element.subtext"
                    :class="['edit-input', {isEdit: isEdit[element.id]}]"
                    :readonly="!isEdit"
                    :value="element.subtext"
                    name="subtext"
                    type="text"
                  />
                </div>

                <div class="btns">
                  <button
                    :class="{hide: isEdit[element.id]}"
                    title="#edit"
                    type="button"
                    @click="editTask(element.id)"
                  >
                    <FilePenLine :size="20" />
                  </button>

                  <button
                    :class="{hide: !isEdit[element.id]}"
                    title="#save"
                    type="button"
                    @click="saveTask(element.id, element.subtext)"
                  >
                    <SaveAll :size="20" />
                  </button>

                  <button
                    title="#delete"
                    type="button"
                    @click="deleteTask(element.id)"
                  >
                    <Trash2 :size="20" />
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column done">
        <div class="header">
          <p class="title">
            <SquareCheckBig :size="20" color="green" />
            #Done
          </p>
        </div>

        <div class="content">
          <draggable
            v-model="columns.done"
            class="drag"
            group="tasks"
            item-key="id"
            @change="event => updateTaskStatus('done', event)"
            @start="drag = true"
          >
            <template #item="{element}">
              <div :key="element.id" :data-id="element.id" class="item">
                <div>
                  <h3>
                    {{ getPriorityIcon(element.priority) + element.taskTitle }}
                  </h3>
                  <span>({{ element.date }})</span>
                </div>

                <div class="form-group">
                  <label
                    :class="{'show-label': isEdit[element.id]}"
                    for="subtext"
                  >
                    Edit
                  </label>

                  <input
                    v-model="element.subtext"
                    :class="['edit-input', {isEdit: isEdit[element.id]}]"
                    :readonly="!isEdit"
                    :value="element.subtext"
                    name="subtext"
                    type="text"
                  />
                </div>

                <div class="btns">
                  <button
                    :class="{hide: isEdit[element.id]}"
                    title="#edit"
                    type="button"
                    @click="editTask(element.id)"
                  >
                    <FilePenLine :size="20" />
                  </button>

                  <button
                    :class="{hide: !isEdit[element.id]}"
                    title="#save"
                    type="button"
                    @click="saveTask(element.id, element.subtext)"
                  >
                    <SaveAll :size="20" />
                  </button>

                  <button
                    title="#delete"
                    type="button"
                    @click="deleteTask(element.id)"
                  >
                    <Trash2 :size="20" />
                  </button>
                </div>
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
