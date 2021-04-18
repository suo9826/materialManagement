<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ this.cardTiltle }}</span>
      <i class="el-icon-refresh" style="float: right" @click="fresh"></i>
    </div>
    <div
      v-loading="loading"
      :id="`${chartsId}`"
      style="height: 300px; width: 100%"
    ></div>
  </el-card>
</template>
<script>
export default {
  props: {
    chartsId: {
      type: String,
      default: "chartsId"
    },
    cardTiltle: {
      type: String,
      default: ""
    },
    option: {
      type: Object,
      default: () => ({})
    },
    path: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  watch: {
    option(newValue) {
      this.myChart.setOption(newValue, true);
    }
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(
        document.getElementById(`${this.chartsId}`)
      );
      this.myChart.setOption(this.option);
    },
    fresh() {
      this.$emit("onFresh");
    }
  }
};
</script>
<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  margin: 10px;
}
i {
  cursor: pointer;
}
</style>
