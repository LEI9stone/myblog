<script setup>
import ChangeSize from './ChangeSize.vue';
import ChangeWidth from './ChangeWidth.vue';
import ChangeHeight from './ChangeHeight.vue';
</script>

<template>
  <a-tabs>
    <a-tab-pane key="size" title="改变大小">
      <a-tabs>
        <a-tab-pane key="size_width" title="宽度改变">
          <ChangeWidth />
        </a-tab-pane>
        <a-tab-pane key="size_height" title="高度改变">
          <ChangeHeight />
        </a-tab-pane>
        <a-tab-pane key="size_all" title="最终交互">
          <ChangeSize />
        </a-tab-pane>
      </a-tabs>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped lang="scss">
.arco-tabs {
  width: 1180px;
  min-width: 100vh;
  margin: 0 auto;
}
</style>
