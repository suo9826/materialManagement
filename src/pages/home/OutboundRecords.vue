<template>
  <card-panel
    title="最近10条出库记录"
    style="margin-bottom: 10px"
    :loading="loading"
    @refresh="handleFresh"
  >
    <el-table
      v-loading="loading"
      :header-cell-style="{ background: 'rgb(238, 238, 238)' }"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="300"
    >
      <el-table-column label="时间" min-width="200px" prop="out_time">
      </el-table-column>
      <el-table-column
        prop="product_name"
        label="名称"
        min-width="200px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="out_nums"
        min-width="150px"
        label="数量"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="200px"
        prop="out_agent"
        label="经办人"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </card-panel>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      tableData: [],
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
      this.$axios.post('/product/getchukujilu', { pageNum: 1 }).then(res => {
        this.loading = false
        if (res.success) {
          this.tableData = res.data.list
        }
      })
    },
    handleFresh () {
      this.fetchData()
    }
  }
}
</script>
