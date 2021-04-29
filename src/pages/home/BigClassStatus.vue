<template>
  <card-panel
    title="大类分布状态"
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
    trigger: 'item',
    formatter: '{b} <br />总资产：{c}'
  },
  legend: {
    show: true,
    right: 20
  },
  series: [
    {
      id: 'type_max',
      name: '大类',
      type: 'pie',
      radius: '50%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
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
      this.$axios.get('/typemaxStatus').then(res => {
        this.loading = false
        if (res.success) {
          this.option = this.calcOption(res.data)
        }
      })
    },
    // handleFresh () {
    //   this.fetchData()
    // },
    calcOption (data = {}) {
      const option = cloneDeep(basicOption)
      option.series = option.series.map(s => {
        return { ...s, data: data[s.id] || [] }
      })
      console.log(option);
      return option
    }
  }
}
</script>
