<template>
  <div @mousedown="onMousedown"></div>
</template>
<script setup>
function onMousedown() {
  // 鼠标按下时的逻辑
}
function onMousemove() {
  // 鼠标移动时的逻辑
}
function onMouseup() {
  // 鼠标抬起时的逻辑
  // 鼠标脱离窗口时的逻辑
}
onMounted(() => {
  document.body.addEventListener('mousemove', onMousemove);
  document.body.addEventListener('mouseup', onMouseup);
  document.body.addEventListener('mouseleave', onMouseup)
})
</script>