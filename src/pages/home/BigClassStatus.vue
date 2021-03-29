<template>
  <charts-card
    chartsId="aaa"
    class="half-charts"
    key="bigclassstatus1"
    cardTiltle="大类分布状态"
    :option="option"
    @onFresh="handleFresh"
    :loading="loading"
  ></charts-card>
</template>
<script>
import ChartsCard from "../../components/ChartsCard.vue";

const basicOption = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    // orient: 'vertical',
    // left: 'left'
    show: true,
    right: "auto"
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "搜索引擎" },
        { value: 735, name: "直接访问" },
        { value: 580, name: "邮件营销" },
        { value: 484, name: "联盟广告" },
        { value: 300, name: "视频广告" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

export default {
  components: { ChartsCard },
  data() {
    return {
      option: basicOption,
      loading: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$axios.get("/smockWarning").then(res => {
        this.loading = false;
        if (res.data.success) {
          this.option = this.calcOption(res.data.data);
        }
      });
    },
    handleFresh() {
      this.fetchData();
    },
    calcOption(data = {}) {
      const option = cloneDeep(basicOption);
      option.xAxis.data = data.map(item => item.name);
      option.series[0].data = data.map(item => ({
        value: (parseInt(item.val) / 1048576).toFixed(2),
        oriData: item
      }));
      return option;
    }
  }
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
