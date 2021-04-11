<template>
  <div class="container">
    <smock-warning></smock-warning>
    <big-class-status></big-class-status>
    <inbound-records></inbound-records>
    <outbound-records></outbound-records>
  </div>
</template>
<script>
import ChartsCard from "../../components/ChartsCard.vue";
import BigClassStatus from "./BigClassStatus.vue";
import SmockWarning from "./SmockWarning.vue";
import OutboundRecords from "./OutboundRecords.vue";
import InboundRecords from './InboundRecords.vue';
export default {
  components: { ChartsCard, SmockWarning, BigClassStatus, OutboundRecords, InboundRecords },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  overflow: auto;
}
</style>
