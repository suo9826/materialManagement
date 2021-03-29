<template>
  <el-input
    :placeholder="placeholder"
    prefix-icon="el-icon-search"
    v-model="filter"
    class="search"
    size="small"
    @keyup.enter.native="handleSearch"
  >
  </el-input>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入名称/描述"
    }
  },
  data() {
    return {
      filter: ""
    };
  },
  methods: {
    handleSearch() {
      const filter = this.filter;
      this.$emit("onSearch", filter);
    }
  }
};
</script>
<style scoped>
.search {
  float: right;
  width: 200px;
}
</style>
