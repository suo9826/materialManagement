<template>
  <div class="container">
    <el-form
      ref="ruleForm"
      class="containerForm"
      label-position="right"
      label-width="80px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item label="录入方式" prop="methods">
        <el-radio-group v-model="ruleForm.methods">
          <el-radio label="1">人工录入</el-radio>
          <el-radio label="3">文件录入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.methods === '3'"
        label="上传文件"
        :required="ruleForm.methods === '3'"
      >
        <el-upload
          class="upload-demo"
          drag
          action=""
          :before-upload="beforeFileUpload"
          :multiple="false"
          :file-list="fileList"
          name="excelFile"
          :http-request="uploadFile"
          :on-change="handleFileListChange"
          :on-remove="handleFileRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传excel，且不超过2MB
            <a @click="loadDemo">下载示例模板</a>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品名称" prop="product_id">
        <el-select
          filterable
          v-model="ruleForm.product_id"
          placeholder="请选择"
        >
          <el-option
            v-for="item in productList"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.date"
          style="width: 100%"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="数量" prop="product_nums" required>
        <el-input-number
          v-model="ruleForm.product_nums"
          :min="1"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="供应商" prop="product_supplier">
        <el-select
          v-model="ruleForm.product_supplier"
          placeholder="请选择供应商"
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
      <el-form-item class="formFotter">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      suppliers: [],
      ruleForm: {
        product_id: '',
        methods: '1',
        product_nums: 1,
        product_supplier: '',
        date: ''
      },
      rules: {
        product_id: [{ required: true, message: '请选择', trigger: 'blur' }],
        product_supplier: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        date: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      file: null,
      fileList: [],
      productList: []
    }
  },
  created () {
    this.fetchProductList()
    this.fetchSuppliers()
  },
  methods: {
    fetchProductList () {
      this.$axios.get('/product/list').then(res => {
        if (res) {
          this.productList = res
        }
      })
    },
    fetchSuppliers () {
      this.$axios.get('/supplier/getAllSupplierName').then(res => {
        if (res) {
          this.suppliers = res
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/product/ruku', {
            ...this.ruleForm
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    beforeFileUpload (file) {
      this.file = file
      const isExcel =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isExcel) {
        this.$message.error('上传文件只能是excel')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isExcel && isLt2M
    },
    uploadFile () {
      let formData = new FormData()
      formData.append('excelFile', this.file)
      this.$axios
        .post('/readExcel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data; charset=utf-8'
          }
        })
        .then(res => {
          if (res.success) {
            const {
              date,
              product_id,
              product_nums,
              product_root,
              product_supplier
            } = res.data
            this.ruleForm = {
              product_id: product_id || '',
              methods: '3',
              product_nums: product_nums || 1,
              product_supplier: product_supplier || '',
              date: date || '',
              product_root: product_root || ''
            }
            console.log(this.fileList)
          }
        })
    },
    handleFileListChange (file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleFileRemove () {
      this.ruleForm = {
        ...this.ruleForm,
        product_name: '',
        methods: '3',
        product_nums: 1,
        product_supplier: '',
        date: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
  &:hover {
    .icon-delete {
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
