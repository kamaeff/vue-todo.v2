<script setup>
import {ref} from 'vue';

const props = defineProps({
  element: Object,
});

const getPriorityIcon = priority => {
  switch (priority) {
    case 'A':
      return '🔥 ';
    case 'B':
      return '⭐ ';
    case 'C':
      return '❄️ ';
    default:
      return '';
  }
};

const localElement = ref(props.element);
</script>

<template>
  <div v-if="localElement" :class="{done: localElement.status === 'done'}">
    <h3 class="title">
      {{ getPriorityIcon(localElement.priority) + localElement.title }}
    </h3>
    <p v-if="localElement.date">
      #Done at: [
      <span style="font-weight: 600">{{ localElement.date }} </span> ]
    </p>
  </div>
</template>

<style scoped>
.title {
  max-width: 70%;
  display: flex;
  align-items: center;
  gap: 5px;

  font-weight: 500;
  font-size: 14px;
}

p {
  font-weight: 300;
  font-size: 12px;
}

.done {
  text-decoration: line-through;
}
</style>
