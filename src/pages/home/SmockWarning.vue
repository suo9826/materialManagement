<template>
  <card-panel
    title="库存预警"
    style="margin-bottom: 10px"
    :loading="loading"
    @refresh="fetchData"
  >
    <v-chart
      :autoresize="true"
      style="height: 300px; width: '100%'"
      :option="option"
      :update-options="{ notMerge: true }"
    />
  </card-panel>
</template>
<script>
import { cloneDeep } from 'lodash'
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
    },
    {
      name: '预警值',
      id: 'product_warning',
      type: 'line',
    }
  ]
}

export default {
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
      option.xAxis[0].data = data.product_name
      option.series = option.series.map(s => {
        return { ...s, data: data[s.id] || [] }
      })
      return option
    }
  }
}
</script>
