<template>
  <div class="container">
    <div class="toolbar">
      <el-button
        :disabled="selection.length === 0"
        @click="handleExport"
        icon="el-icon-download"
        size="small"
      >
        导出
      </el-button>
      <el-button @click="fetchData" icon="el-icon-refresh" size="small">
        刷新
      </el-button>
      <common-search
        @onSearch="handleSearch"
        placeholder="请输入名称"
      ></common-search>
    </div>
    <alert :num="selection.length"></alert>
    <el-table
      :header-cell-style="{ background: 'rgb(238, 238, 238)' }"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="calc(100% - 120px)"
      v-loading="loading"
      :row-key="(row) => row.product_id"
    >
      <el-table-column :reserve-selection="true" type="selection" width="55">
      </el-table-column>
      <el-table-column
        label="名称"
        prop="product_name"
        min-width="100px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="product_nums"
        min-width="100px"
        label="库存"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="product_warning"
        min-width="100px"
        label="预警值"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="product_caigou"
        min-width="100px"
        label="建议采购数量"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column min-width="100px" label="所属类别" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.product_typemax }}-{{ scope.row.product_typemin }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,prev, pager, next,jumper"
      :total="total"
      @current-change="handlePaginationChange"
      :current-page.sync="currentPage"
    >
    </el-pagination>
  </div>
</template>
<script>
import Alert from '@/components/Alert'
import CommonSearch from '../components/CommonSearch.vue'
import { templateDownLoad } from "./util";
export default {
  components: {
    Alert,
    CommonSearch
  },
  data () {
    return {
      total: 0,
      currentPage: 1,
      filter: '',
      selection: [],
      tableData: [],
      loading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData (extraParams = {}) {
      this.loading = true
      const params = {
        pageNum: this.currentPage,
        product_name: this.filter,
        ...extraParams
      }
      this.$axios.post('/product/yuce', params).then(res => {
        if (res.success) {
          this.loading = false
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    handleSearch (filter) {
      this.filter = filter
      this.currentPage = 1
      this.fetchData()
    },
    handlePaginationChange (currentPage) {
      this.fetchData()
    },
    handleExport () {
      this.$confirm('确认导出选中数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selection.map(item => item.product_id).join(',')
        this.$axios.get('/export/caigou', { params: { ids } })
          .then(res => {
            if (res === false) {
              this.$message.error('导出失败')
              return null
            }
            this.clearSelection()
            this.$refs.multipleTable.clearSelection();
            const url = `http://localhost:3000/api/export/caigou?ids=${ids}`
            templateDownLoad(url)
          })
      })
    },
    clearSelection () {
      this.selection = [];
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>
