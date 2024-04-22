<script setup>
import { ref, computed, onMounted } from 'vue';
import WidthResize from './Icon/WidthResize.vue';
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
    startX: event.clientX,
    open: true,
  }
}
const onMousemove = throttle((event) => {
  if (sizeInfo.value.open) {
    const { clientX } = event;
    const { startX, width } = sizeInfo.value;
    const moveX = clientX - startX;
    parser.value.width = width + moveX;
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
        <div class="width-size" @mousedown="onMousedown">
          <WidthResize />
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

  .width-size {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -7px;
    width: 14px;
    cursor: col-resize;
    svg {
      position: absolute;
      top: 50%;
      margin-top: -7px;
    }
  }
}
</style>
