<template>
  <div>
    <el-alert
      :closable="false"
      type="info"
      :title="`已勾选 ${num} 条数据`"
      show-icon
    >
    </el-alert>
  </div>
</template>
<script>
export default {
  props: {
    num: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style>
.el-alert {
  margin: 10px 0;
  height: 30px;
  background-color: rgb(230, 247, 255) !important;
  color: black;
  font-size: 12px;
  border: 1px solid rgb(148, 214, 255);
}
.el-alert i {
  color: rgb(25, 141, 250);
  font-size: 12px;
}
</style>
