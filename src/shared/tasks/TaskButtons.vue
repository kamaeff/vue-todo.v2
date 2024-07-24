<script setup>
import {FilePenLine, SaveAll, Trash2} from 'lucide-vue-next';

const props = defineProps({
  isEdit: Boolean,
  hiddenSave: Boolean,
});

const emit = defineEmits(['edit-task', 'save-task', 'delete-task']);

const editTask = () => {
  emit('edit-task');
};

const saveTask = () => {
  emit('save-task');
};

const deleteTask = () => {
  emit('delete-task');
};
</script>

<template>
  <div class="btns">
    <div :hidden="hiddenSave" class="save-edit">
      <button
        :class="{hide: isEdit}"
        title="#edit"
        type="button"
        @click="editTask"
      >
        <FilePenLine :size="16" />
      </button>

      <button
        :class="{hide: !isEdit}"
        title="#save"
        type="button"
        @click="saveTask"
      >
        <SaveAll :size="16" />
      </button>
    </div>

    <button title="#delete" type="button" @click="deleteTask">
      <Trash2 :size="16" />
    </button>
  </div>
</template>

<style scoped>
.btns {
  position: absolute;
  right: 2%;

  display: flex;
  align-items: center;

  button[type='button'] {
    cursor: pointer;

    color: var(--color-text);
    background: transparent;
    outline: none;

    border: none;
    border-radius: 10px;

    transition: 0.3s ease-in-out;

    &:hover {
      transform: translateY(-5px);
    }
  }
}

.hide {
  display: none;
}
</style>
