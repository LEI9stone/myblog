<script setup>
import { ref, computed, onMounted } from 'vue';
import HeightResize from './Icon/HeightResize.vue';
import { throttle } from 'lodash-es'
const parser = ref({
  width: 100,
  height: 100,
});
const sizeInfo = ref({
  width: 100,
  height: 100,
});
function onMousedown(event) {
  sizeInfo.value = {
    ...sizeInfo.value,
    ...parser.value,
    startY: event.clientY,
    open: true,
  }
}
const onMousemove = throttle((event) => {
  if (sizeInfo.value.open) {
    const { clientY } = event;
    const { startY, height } = sizeInfo.value;
    const moveY = clientY - startY;
    parser.value.height = height + moveY;
  }
}, 60)
function onMouseup() {
  sizeInfo.value = {
    ...sizeInfo.value,
    open: false,
  }
}
onMounted(() => {
  document.body.addEventListener('mouseup', onMouseup);
  document.body.addEventListener('mousemove', onMousemove);
  document.body.addEventListener('mouseleave', onMouseup);
})
const sizeStyle = computed(() => {
  const { width, height } = parser.value;
  return {
    width: `${width}px`,
    height: `${height}px`
  }
})
</script>

<template>
  <div class="templ">
    <div>
      <div class="parser" :style="{ ...sizeStyle }">
        <div class="height-size" @mousedown="onMousedown">
          <HeightResize />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.templ {
  position: relative;
  width: 100vh;
  height: 100vh;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  .parser {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: bisque;
    cursor: all-scroll;
  }
  
  .height-size {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -7px;
    height: 14px;
    cursor: row-resize;
    svg {
      position: absolute;
      left: 50%;
      margin-left: -7px;
    }    
  }
}
</style>
