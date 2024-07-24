<script setup>
import {nextTick, ref, watch} from 'vue';

const props = defineProps({
  isEdit: Boolean,
  subtext: String,
});

const emit = defineEmits(['update:subtext']);
const internalSubtext = ref(props.subtext);
const textarea = ref(null);

const resizeTextarea = event => {
  const target = event.target;
  target.style.height = '100%';
  target.style.height = target.scrollHeight + 'px';
  emit('update:subtext', target.value);
};

watch(textarea, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nextTick(() => {
      resizeTextarea({target: textarea.value});
    });
  }
});
</script>

<template>
  <div class="form-group">
    <label :class="{'show-label': isEdit}" for="subtext"> Edit </label>

    <textarea
      ref="textarea"
      v-model="internalSubtext"
      :class="['edit-input', {isEdit: isEdit}]"
      :readonly="!isEdit"
      name="subtext"
      @input="resizeTextarea"
    ></textarea>
  </div>
</template>

<style scoped>
.form-group {
  position: relative;
  text-align: left;

  margin-top: 5px;

  label {
    display: none;
    position: absolute;
    left: 15px;
    top: 0;

    transform: translateY(-50%);
    transition:
      top 0.3s,
      font-size 0.3s;

    background: var(--color-background-mute);
    font-weight: 500;
    font-size: 12px;
  }

  .edit-input {
    max-width: 100%;
    width: 100%;

    min-height: 40px;
    max-height: 100px;

    overflow-y: auto;

    font-family: 'Rubik', sans-serif;
    font-size: 12px;
    font-weight: 500;

    color: var(--color-task);
    background: transparent;
    outline: none;
    border: none;
  }

  .isEdit {
    border: 1px solid var(--color-text);
    border-radius: 8px;

    padding: 10px;
    font-size: 12px;
  }

  .show-label {
    display: block;
  }
}
</style>
