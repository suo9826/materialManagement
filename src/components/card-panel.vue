<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix header">
      <span class="title">{{ title }}</span>
      <i
        v-if="!hideRefresh"
        class="el-icon-refresh refresh"
        @click="handleRefresh"
      />
    </div>
    <div v-loading="loading" :style="bodyStyle">
      <slot />
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hideRefresh: {
      type: Boolean,
      default: false,
    },
    bodyStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleRefresh () {
      this.$emit('refresh');
    },
  },
};
</script>
<style scoped lang="scss">
.header {
  height: 32px;
  line-height: 32px;
  position: relative;

  .refresh {
    float: right;
    line-height: 32px;
    cursor: pointer;
  }
}

::v-deep .q-card__body {
  padding: 8px;
}
</style>
