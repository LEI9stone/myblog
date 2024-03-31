<script setup>
import { ref, computed, watch } from 'vue';
import { withBase } from 'vitepress'
import { data as posts } from './post.data'
import FontistoDate from './components/FontistoDate.vue'
import MdiTag from './components/MdiTag.vue'
import ArcticonsBook from './components/ArcticonsBook.vue'
const page = ref(1);
const per_page = ref(10);
const total = posts.length;

const current_posts = computed(() => {
  return posts.slice((page.value - 1) * per_page.value, page.value * per_page.value);
});

const onPageChange = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

</script>

<template>
  <div class="vp-doc custom-home">
    <div class="abstract-item" v-for="(post, index) in current_posts" :key="index">
      <div class="post-title">
        <a :href="withBase(post.url)" class="post-title-link">
          {{ post.title }}
        </a>
      </div>
      <div class="post-meta">
        <span class="post-meta-item">
          <span class="meta-icon">
            <FontistoDate />
          </span>
          <span class="meta-label">发表于</span>
          <span class="meta-value">{{ post.date.string }}</span>
        </span>
        <span class="post-meta-item" v-if="post.author">
          <span class="meta-icon">
            <ArcticonsBook />
          </span>
          <span class="meta-label">作者：</span>
          <span class="meta-value">{{ post.author }}</span>
        </span>
        <span class="post-meta-item" v-if="post.tags">
          <span class="meta-icon">
            <MdiTag />
          </span>
          <span class="meta-tag" v-for="tag in post.tags">{{ tag }}</span>
        </span>
      </div>
      <div v-html="post.excerpt"></div>
      <div class="post-button">
        <a class="btn" :href="withBase(post.url)">阅读全文»</a>
      </div>
    </div>
    <a-pagination @change="onPageChange" v-model:current="page" class="pagination" :total="total" show-jumper />
  </div>
</template>
<style lang="scss" scoped>
.pagination {
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 50px;

  ::v-deep(.arco-pagination-item) {
    margin-top: 0;
  }
}

.custom-home {
  max-width: 860px;
  margin: 0 auto;
}

.abstract-item {
  position: relative;
  margin: 0 auto 40px;
  padding: 16px 20px;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  -webkit-transition: all .3s;
  transition: all .3s;
  background-color: var(--vp-c-bg);
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
  }

  a {
    color: inherit;
    text-decoration: none;
  }
}

.post-title {
  width: 100%;
  font-size: 24px;
  line-height: 46px;
  display: inline-block;
  text-align: center;

  .post-title-link {
    border-bottom: none;
    display: inline-block;
    position: relative;
    vertical-align: top;

    &::before {
      background: var(--custom-title);
      bottom: 0;
      content: '';
      height: 2px;
      left: 0;
      position: absolute;
      transform: scaleX(0);
      visibility: hidden;
      width: 100%;
      transition-delay: 0s;
      transition-duration: 0.2s;
      transition-timing-function: ease-in-out;
    }

    &:hover::before {
      transform: scaleX(1);
      visibility: visible;
    }
  }

  &:hover {
    border-bottom-color: #222;
  }
}

.post-meta {
  display: flex;
  color: #999;
  font-family: 'Lato', "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 12px;
  margin: 3px 0 60px 0;
  justify-content: center;

  .meta-tag {
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 24px;
    padding: 0 8px;
    font-weight: 500;
    font-size: 12px;
    line-height: 22px;
    vertical-align: middle;
    border: 1px solid transparent;
    border-radius: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #f2f3f5;
    border-color: transparent;

    &:last-child {
      margin-right: 0;
    }
  }

  .meta-label {
    margin-right: 3px;
  }

  .meta-icon {
    margin-right: 3px;
  }

  &-item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    svg {
      width: 14px;
      height: 14px;
    }

    &+&::before {
      content: '|';
      margin: 0 5px;
    }
  }
}

.post-button {
  margin-top: 40px;
  text-align: center;

  .btn {
    background: #222;
    border: 2px solid #222;
    border-radius: 0;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    line-height: 2;
    padding: 0 20px;
    text-decoration: none;
    transition-property: background-color;
    transition-delay: 0s;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;

    &:hover {
      background: #fff;
      border-color: #222;
      color: #222;
    }
  }
}
</style>
