<template>
  <charts-card
    class="half-charts"
    key="stockWarning"
    cardTiltle="最近10条入库记录"
    :option="option"
    @onFresh="handleFresh"
  ></charts-card>
</template>
<script>
import ChartsCard from '../../components/ChartsCard.vue'

const basicOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    right: 20,
    data: ['数量', '预警值']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '数量',
      type: 'line',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    },
    {
      name: '预警值',
      type: 'line',
      barWidth: '60%',
      data: [10, 10, 10, 10, 10, 10, 10]
    }
  ]
}

export default {
  components: { ChartsCard },
  data () {
    return {
      option: basicOption
    }
  },
  created () {
    // this.fetchData()
  },
  methods: {
    fetchData () {
      this.$axios.get('/smockWarning').then(res => {
        if (res) {
          this.option = this.calcOption(res.data)
        }
      })
    },
    handleFresh () {
      this.fetchData()
    },
    calcOption (data = {}) {
      const option = cloneDeep(basicOption)
      option.xAxis.data = data.map(item => item.name)
      option.series[0].data = data.map(item => ({
        value: (parseInt(item.val) / 1048576).toFixed(2),
        oriData: item
      }))
      return option
    }
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  overflow: auto;
}
</style>
