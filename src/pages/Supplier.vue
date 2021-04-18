<template>
  <div class="container">
    <div class="toolbar">
      <el-button @click="onCreate" icon="el-icon-plus" size="small">
        新建
      </el-button>
      <el-button
        :disabled="selection.length === 0"
        icon="el-icon-delete"
        size="small"
        @click="handleDelete"
      >
        删除
      </el-button>
      <el-button @click="fetchData" icon="el-icon-refresh" size="small">
        刷新
      </el-button>
      <!-- <el-button
        :disabled="selection.length === 0"
        @click="handleExport"
        icon="el-icon-top-right"
        size="small"
      >
        导出
      </el-button> -->
      <common-search
        @onSearch="handleSearch"
        placeholder="请输入名称/电话"
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
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="名称" min-width="150px">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="onUpdate(scope.row)"
          >
            {{ scope.row.supplier_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplier_introduce"
        label="描述"
        min-width="150px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="supplier_address"
        min-width="150px"
        label="地址"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        min-width="150px"
        label="联系电话"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="100px"
        prop="owner"
        label="创建人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column min-width="150px" prop="time" label="创建时间">
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
    <el-dialog
      :close-on-click-modal="false"
      width="550px"
      @close="handleCanel('ruleForm')"
      :title="dialogtitle"
      :visible.sync="visible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="supplier_name">
          <el-input v-model="ruleForm.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="supplier_introduce">
          <el-input v-model="ruleForm.supplier_introduce"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="supplier_address">
          <el-input v-model="ruleForm.supplier_address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
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
</template>
<script>
import Alert from '@/components/Alert'
import CommonSearch from '../components/CommonSearch.vue'
export default {
  components: {
    Alert,
    CommonSearch
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电话'))
      }
      const re = /\d+/
      if (!re.test(value)) {
        return callback(new Error('请输入数字'))
      }
      callback()
    }
    return {
      total: 0,
      currentPage: 1,
      action: 'create',
      dialogtitle: '新建供应商',
      filter: '',
      visible: false,
      ruleForm: {
        supplier_name: '',
        supplier_desc: '',
        supplier_address: '',
        phone: '',
        owner: '',
        time: ''
      },
      rules: {
        supplier_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      selection: [],
      tableData: [],
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(extraParams = {}, isReset = false) {
      this.loading = true
      const params = {
        pageNum: this.currentPage,
        filter: this.filter,
        ...extraParams
      }
      this.$axios.post('/supplier/list', params).then(res => {
        this.loading = false
        if (res.success) {
          if (isReset) {
            this.resetTable()
          }
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleDelete() {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .get('/supplier/delete', {
            params: {
              ids: this.selection.map(item => item.supplier_id)
            }
          })
          .then(res => {
            if (res.success) {
              this.fetchData()
            }
          })
      })
    },
    resetTable() {
      this.selection = []
      this.currentPage = 1
    },
    onUpdate(row) {
      this.action = 'update'
      this.dialogtitle = '编辑供应商'
      this.ruleForm = {
        ...this.ruleForm,
        ...row
      }
      this.visible = true
    },
    onCreate() {
      this.action = 'create'
      this.dialogtitle = '新建供应商'
      this.ruleForm = {
        supplier_name: '',
        supplier_desc: '',
        supplier_address: '',
        phone: '',
        owner: '',
        time: ''
      }
      this.visible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`/supplier/${this.action}`, {
              ...this.ruleForm
            })
            .then(res => {
              if (res.success) {
                this.visible = false
                this.fetchData()
              }
            })
        }
      })
    },
    handleCanel(formName) {
      this.visible = false
      this.$refs[formName].resetFields()
    },
    handleSearch(filter) {
      this.filter = filter
      this.currentPage = 1
      this.fetchData({}, true)
    },
    handlePaginationChange() {
      this.fetchData({}, false)
    },
    handleExport() {
      this.$confirm('确认导出选中数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          data: this.selection
        }
        this.$axios.post('/report/export', params)
      })
    }
  }
}
</script>
