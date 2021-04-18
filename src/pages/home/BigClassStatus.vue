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
import ChartsCard from '../../components/ChartsCard.vue'
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
  components: { ChartsCard },
  data() {
    return {
      option: basicOption,
      loading: false,
      interval: null
    }
  },
  created() {
    this.fetchData()
    this.interval = setInterval(() => {
      this.fetchData()
    }, 60000)
  },
  beforeDestroy() {
    this.interval = clearInterval(this.interval)
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$axios.get('/typemaxStatus').then(res => {
        this.loading = false
        if (res.success) {
          this.option = this.calcOption(res.data)
        }
      })
    },
    handleFresh() {
      this.fetchData()
    },
    calcOption(data = {}) {
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
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  overflow: auto;
}
</style>
