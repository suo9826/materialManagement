<template>
  <charts-card
    class="half-charts"
    key="stockWarning"
    cardTiltle="库存预警"
    :option="option"
    @onFresh="handleFresh"
    chartsId="bb"
    :loading="loading"
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
      id: 'product_nums',
      type: 'line',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    },
    {
      name: '预警值',
      id: 'product_warning',
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
      option: basicOption,
      loading: false,
      interval: null
    }
  },
  created () {
    this.fetchData()
    this.interval = setInterval(() => {
      this.fetchData()
    }, 60000)
  },
  beforeDestroy () {
    this.interval = clearInterval(this.interval)
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$axios.get('/smockWarning').then(res => {
        this.loading = false
        if (res.success) {
          this.option = this.calcOption(res.data)
        }
      })
    },
    handleFresh () {
      this.fetchData()
    },
    calcOption (data = {}) {
      const option = cloneDeep(basicOption)
      option.xAxis.data = data.map(item => item.product_name)
      option.series = option.series.map(s => {
        return { ...s, data: data[s.id] || [] }
      })
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
