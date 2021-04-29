<template>
  <div class="container">
    <el-row>
      <el-col :span="12">
        <smock-warning></smock-warning>
      </el-col>
      <el-col :span="12">
        <big-class-status></big-class-status>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <inbound-records></inbound-records>
      </el-col>
      <el-col :span="24">
        <outbound-records></outbound-records>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import BigClassStatus from "./BigClassStatus.vue";
import SmockWarning from "./SmockWarning.vue";
import OutboundRecords from "./OutboundRecords.vue";
import InboundRecords from './InboundRecords.vue';
export default {
  components: { SmockWarning, BigClassStatus, OutboundRecords, InboundRecords },
  data () {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.container {
  /* display: flex;
  flex-wrap: wrap; */
  padding: 10px;
  /* overflow: auto; */
}
</style>
