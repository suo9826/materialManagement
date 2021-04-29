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
        placeholder="请输入名称/所属类别"
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
      <el-table-column label="名称" min-width="100px">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="onUpdate(scope.row)"
          >
            {{ scope.row.product_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_nums"
        min-width="100px"
        label="数量"
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
        prop="product_price"
        min-width="100px"
        label="单价"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="product_allprice"
        min-width="100px"
        label="总价"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column min-width="100px" label="所属类别" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.product_typemax }}-{{ scope.row.product_typemin }}
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="图片" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
              v-if="scope.row.product_root !== ''"
              style="width: 20px; height: 20px"
              :src="scope.row.product_root"
              :preview-src-list="[scope.row.product_root]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
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
    <el-dialog
      :close-on-click-modal="false"
      width="550px"
      @close="handleCanel('ruleForm')"
      :title="dialogtitle"
      widyh="550px"
      :visible.sync="visible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="大类" prop="product_typemax">
          <el-select
            filterable
            v-model="ruleForm.product_typemax"
            placeholder="请选择"
            @change="handleChange"
          >
            <el-option
              v-for="item in bigClassList"
              :key="item.type_id"
              :label="item.type_max"
              :value="item.type_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小类" prop="product_typemin">
          <el-select
            filterable
            v-model="ruleForm.product_typemin"
            placeholder="请选择"
          >
            <el-option
              v-for="item in smallList"
              :key="item.type_id"
              :label="item.type_max"
              :value="item.type_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="product_name">
          <el-input v-model="ruleForm.product_name"></el-input>
        </el-form-item>
        <el-form-item label="预警值" prop="product_warning" required>
          <el-input-number
            v-model="ruleForm.product_warning"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="单价" prop="product_price" required>
          <el-input-number
            :min="0.0"
            :precision="2"
            :step="0.1"
            v-model="ruleForm.product_price"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="供应商" prop="product_supplier">
          <el-select
            v-model="ruleForm.product_supplier"
            placeholder="请选择供应商"
            multiple
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
        <el-form-item label="图片" prop="img" style="display: inline-block">
          <el-upload
            class="avatar-uploader"
            action=""
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :show-file-list="false"
          >
            <div class="avatar">
              <img
                width="178"
                height="178"
                v-if="ruleForm.product_root"
                :src="ruleForm.product_root"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          prop="product_price"
          v-if="ruleForm.product_root !== ''"
          style="display: inline-block; margin-left: -80px"
        >
          <el-button type="text" @click="handleClearPhoto">清除图片</el-button>
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
import { templateDownLoad } from "./util";
export default {
  components: {
    Alert,
    CommonSearch
  },
  data () {
    const checkName = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入名称'))
      } else {
        if (this.action === 'update' && value === this.oldName) {
          return callback()
        }
        const name = this.ruleForm.product_name
        this.$axios
          .get('/product/ruku/checkName', {
            params: {
              name
            }
          })
          .then(res => {
            if (!res.success) {
              debugger
              return callback(new Error('名称已存在'))
            }
            return callback()
          })
      }
    }
    return {
      total: 0,
      currentPage: 1,
      action: 'create',
      dialogtitle: '新建产品',
      filter: '',
      visible: false,
      ruleForm: {
        product_name: '',
        product_nums: 1,
        product_price: 0,
        product_supplier: [],
        product_typemax: '',
        product_typemin: '',
        product_warning: 0,
        product_root: ''
      },
      rules: {
        product_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        product_typemax: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        product_typemin: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        product_supplier: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      selection: [],
      tableData: [],
      smallList: [],
      bigClassList: [],
      suppliers: [],
      oldName: '',
      file: null,
      loading: false
    }
  },
  created () {
    this.fetchBigClass()
    this.fetchSuppliers()
    this.fetchData()
  },
  methods: {
    beforeAvatarUpload (file) {
      this.file = file
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    upload () {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$axios
        .post('/uploadPic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data; charset=utf-8'
          }
        })
        .then(res => {
          if (res.success) {
            this.ruleForm.product_root = res.data
            console.log(this.ruleForm.product_root)
          }
        })
    },
    loadDemo () {
      this.$axios.get('/product/ruku/loadDemo')
    },
    handleRemove () {
      this.ruleForm.product_root = ''
    },
    fetchSuppliers () {
      this.$axios.get('/supplier/getAllSupplierName').then(res => {
        if (res) {
          this.suppliers = res
        }
      })
    },
    handleChange (value) {
      this.ruleForm.product_typemin = ''
      this.$axios.get('/type/getmin', { params: { id: value } }).then(res => {
        this.smallList = res
      })
    },
    fetchBigClass () {
      this.$axios.get('/type/getmax').then(res => {
        if (res) {
          this.bigClassList = res
        }
      })
    },
    fetchData (extraParams = {}) {
      this.loading = true
      const params = {
        pageNum: this.currentPage,
        filter: this.filter,
        ...extraParams
      }
      this.$axios.post('/product/getbytype', params).then(res => {
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
    handleDelete () {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .get('/product/deleteproduct', {
            params: {
              ids: this.selection.map(item => item.product_id)
            }
          })
          .then(res => {
            if (res.success) {
              this.clearSelection()
              this.fetchData()
            }
          })
      })
    },
    onUpdate (row) {
      this.action = 'update'
      this.oldName = row.product_name
      this.dialogtitle = '编辑产品'
      this.$axios
        .get('/type/getmin', { params: { id: row.type_id1 } })
        .then(res => {
          this.smallList = res
        })
      this.ruleForm = {
        product_name: '',
        product_nums: 1,
        product_price: 0,
        product_supplier: [],
        product_typemax: '',
        product_typemin: '',
        product_warning: 0,
        product_root: ''
      }
      this.ruleForm = {
        ...row,
        product_supplier: row.product_supplier.split(','),
        product_typemax: row.type_id1,
        product_typemin: row.type_id2
      }
      this.visible = true
    },
    onCreate () {
      this.action = 'create'
      this.dialogtitle = '新建产品'
      this.ruleForm = {
        product_name: '',
        product_nums: 1,
        product_price: 0,
        product_supplier: [],
        product_typemax: '',
        product_typemin: '',
        product_warning: 0,
        product_root: ''
      }
      this.visible = true
    },
    handleSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`/product/${this.action}`, {
              ...this.ruleForm,
              product_supplier: this.ruleForm.product_supplier.join(',')
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
    handleCanel (formName) {
      this.visible = false
      this.$refs[formName].resetFields()
    },
    handleSearch (filter) {
      this.filter = filter
      this.currentPage = 1
      this.fetchData()
    },
    handlePaginationChange (currentPage) {
      this.fetchData()
    },
    handleClearPhoto () {
      this.ruleForm.product_root = ""
    },
    handleExport () {
      this.$confirm('确认导出选中数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selection.map(item => item.product_id).join(',')
        this.$axios.get('/export/kucun', { params: { ids } })
          .then(res => {
            if (res === false) {
              this.$message.error('导出失败')
              return null
            }
            this.clearSelection()
            this.$refs.multipleTable.clearSelection();
            const url = `http://localhost:3000/api/export/kucun?ids=${ids}`
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
<style lang="scss">
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader {
  width: 178px;
  height: 178px;
  display: block;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  .icon-delete {
    display: none;
  }
}
.el-dialog__body {
  max-height: calc(100vh - 15vh - 54px - 70px - 50px);
  overflow: auto;
}
</style>
