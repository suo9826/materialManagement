<template>
  <div class="container">
    <div class="toolbar">
      <!-- <el-button
        :disabled="selection.length === 0"
        @click="handleExport"
        icon="el-icon-download"
        size="small"
      >
        导出
      </el-button> -->
      <el-button @click="handleRefresh" icon="el-icon-refresh" size="small">
        刷新
      </el-button>
      <el-button
        :disabled="selection.length === 0"
        icon="el-icon-delete"
        size="small"
        @click="handleDelete"
      >
        删除
      </el-button>
      <el-tooltip content="设置过滤条件" placement="left">
        <el-button
          style="float:right"
          size="mini"
          type="primary"
          icon="iconfont icon-guolv"
          @click="filterVisible = true"
        ></el-button>
      </el-tooltip>
      <el-dialog
        :close-on-click-modal="false"
        width="550px"
        @close="handleCanel('ruleForm')"
        title="设置过滤条件"
        :visible.sync="filterVisible"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="时间" prop="date">
            <el-date-picker
              v-model="ruleForm.date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width:320px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="名称" prop="product_name">
            <el-input v-model="ruleForm.product_name"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="product_supplier">
            <el-select
              v-model="ruleForm.product_supplier"
              placeholder="请选择供应商"
              clearable
            >
              <el-option
                v-for="item in suppliers"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经办人" prop="product_agent">
            <el-input v-model="ruleForm.product_agent"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCanel('ruleForm')">取消</el-button>
          <el-button type="primary" @click="handleSubmit('ruleForm')"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </div>
    <alert :num="selection.length"></alert>
    <el-table
      v-loading="loading"
      :header-cell-style="{ background: 'rgb(238, 238, 238)' }"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="时间" min-width="200px" prop="in_time">
      </el-table-column>
      <el-table-column
        prop="product_name"
        label="名称"
        min-width="200px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="in_nums"
        min-width="150px"
        label="数量"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="product_supplier"
        min-width="200px"
        label="供应商"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="200px"
        prop="product_agent"
        label="经办人"
        show-overflow-tooltip
      >
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
export default {
  components: {
    Alert,
    CommonSearch
  },
  data () {
    return {
      loading: false,
      total: 0,
      currentPage: 1,
      ruleForm: {
        date: [],
        product_name: '',
        product_supplier: '',
        product_agent: ''
      },
      rules: {},
      selection: [],
      tableData: [],
      filterVisible: false,
      suppliers: []
    }
  },
  created () {
    this.fetchSuppliers()
    this.fetchData()
  },
  methods: {
    fetchSuppliers () {
      this.$axios.get('/supplier/getAllSupplierName').then(res => {
        if (res) {
          this.suppliers = res
        }
      })
    },
    fetchData (extraParams = {}) {
      this.loading = true
      const params = {
        pageNum: this.currentPage,
        ...this.ruleForm,
        date: this.ruleForm.date.join(','),
        ...extraParams
      }
      this.$axios.post('/product/getrukujilu', params).then(res => {
        this.loading = false
        if (res.success) {
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    handleDelete () {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .get('/product/deleterkjl', {
            params: {
              ids: this.selection.map(item => item.in_id)
            }
          })
          .then(res => {
            if (res.success) {
              this.selection = []
              this.fetchData()
            }
          })
      })
    },
    handleExport () {
      this.$confirm('确认导出选中数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          data: this.selection
        }
        this.$axios.post('/report/export', params).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '导出成功!'
            })
          }
        })
      })
    },
    handleSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.filterVisible = false
          this.fetchData()
        }
      })
    },
    handleCanel (formName) {
      this.filterVisible = false
      // this.$refs[formName].resetFields()
    },
    handlePaginationChange (currentPage) {
      this.fetchData()
    },
    handleRefresh () {
      this.fetchData()
    }
  }
}
</script>
