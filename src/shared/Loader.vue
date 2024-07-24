<script setup>
import {defineProps, computed} from 'vue';
import {Loader} from 'lucide-vue-next';

const props = defineProps({
  isLoading: Boolean,
  size: Number,
  needSub: Boolean,
});

const loaderClass = computed(() => (props.isLoading ? 'loader' : ''));
</script>

<template>
  <div :class="loaderClass">
    <div class="container" v-if="props.isLoading">
      <Loader :size="props.size" class="item" />
      <div class="text">
        <p>#TaskList</p>
        <p v-show="props.needSub" class="sub">Simple and Fast</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.item {
  animation: rotate 2s linear infinite;
}

.text {
  p {
    font-size: 24px;
  }

  .sub {
    display: block;
    font-size: 14px;
    font-weight: 300;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
