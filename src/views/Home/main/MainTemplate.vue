<script setup>
import {SquareCheckBig, TriangleAlert, X} from 'lucide-vue-next';
import draggable from 'vuedraggable';
import {computed, ref} from 'vue';
import MainForm from '@/views/Home/main/components/MainForm.vue';
import {tasks} from '@/store/tasks-mocks.js';
import {notification} from '@/lib/toastService.js';

const drag = ref(false);

const _tasks = ref(tasks);

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

const columns = computed(() => ({
  new: _tasks.value.filter(task => task.status === 'new').sort(sortByPriority),
  inProgress: _tasks.value
    .filter(task => task.status === 'inProgress')
    .sort(sortByPriority),
  done: _tasks.value
    .filter(task => task.status === 'done')
    .sort(sortByPriority),
}));

const sortByPriority = (a, b) => {
  const priorityOrder = {A: 1, B: 2, C: 3};
  return priorityOrder[a.priority] - priorityOrder[b.priority];
};

const updateTaskStatus = (columnName, evt) => {
  if (evt.added) {
    const movedItemId = evt.added.element.id;
    const movedItem = _tasks.value.find(task => task.id === movedItemId);
    if (movedItem) {
      movedItem.status = columnName;
      _tasks.value = [..._tasks.value];

      if (movedItem.status === 'done')
        notification('Gratz! Task completed', 'success');
    }
  }
};
</script>

<!--TODO: Сделать возможность переносить по двойному клику на сл уровень + придумать плавные анимации-->
<!--TODO: Пофиксить стили на адаптиве на телефонке-->

<template>
  <div class="main">
    <MainForm />

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
                    {{ getPriorityIcon(element.priority) + element.title }}
                  </h3>
                  <span>({{ element.date }})</span>
                </div>
                <p>{{ element.text }}</p>
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
                    {{ getPriorityIcon(element.priority) + element.title }}
                  </h3>
                  <span>({{ element.date }})</span>
                </div>
                <p>{{ element.text }}</p>
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
              <div
                :key="element.id"
                :data-id="element.id"
                class="item task-done"
              >
                <div>
                  <h3>
                    {{ getPriorityIcon(element.priority) + element.title }}
                  </h3>
                  <span>({{ element.date }})</span>
                </div>
                <p>{{ element.text }}</p>
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
