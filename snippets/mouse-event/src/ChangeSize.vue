<script setup>
import { ref, computed, onMounted } from 'vue';
import { throttle } from 'lodash-es'
import WidthResize from './Icon/WidthResize.vue';
import HeightResize from './Icon/HeightResize.vue';
const parser = ref({
  width: 100,
  height: 100,
  ratio: 1,
});
const sizeInfo = ref({
  width: 100,
  height: 100,
  ratio: 100 / 100,
});
function onMousedown(event) {
  sizeInfo.value = {
    ...sizeInfo.value,
    ...parser.value,
    startX: event.clientX,
    startY: event.clientY,
    open: true,
  }
}
const onMousemove = throttle((event) => {
  if (sizeInfo.value.open) {
    const { clientX, clientY } = event;
    const { startX, startY, width, height, ratio } = sizeInfo.value;
    const moveX = clientX - startX;
    const moveY = clientY - startY;
    if (moveX >= moveY) {
      parser.value.width = width + moveX;
      parser.value.height = (height + moveX) / ratio;
    } else {
      parser.value.height = height + moveY;
      parser.value.width = (width + moveY) * ratio;
    }
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
  // document.body.addEventListener('mouseleave', onMouseup)
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
        <div class="size" @mousedown="onMousedown">
          <a-button size="mini" shape="round" type="dashed" status="success"
            class="cursor-nwse-resize">
            <template #icon>
              <icon-expand />
            </template>
          </a-button>
        </div>
        <div class="width-size" @mousedown="onMousedown">
          <!-- <WidthResize /> -->
        </div>
        <div class="height-size" @mousedown="onMousedown">
          <!-- <HeightResize /> -->
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
  .size, .height-size, .width-size {
    position: absolute;
  }
  .size {
    bottom: -5px;
    right: -5px;
    z-index: 10;
    transform: rotate(90deg);
    .cursor-nwse-resize {
      cursor: nwse-resize;
    }
  }
  .height-size {
    left: 0;
    right: 0;
    bottom: -7px;
    height: 14px;
    cursor: row-resize;
  }
  .width-size {
    top: 0;
    bottom: 0;
    right: -7px;
    width: 14px;
    cursor: col-resize;
  }
}
</style>
