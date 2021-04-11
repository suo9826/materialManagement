<template>
  <div class="container">
    <el-form
      class="containerForm"
      ref="ruleForm"
      label-position="right"
      label-width="80px"
      :model="ruleForm"
      :rules="rules"
    >
      <!-- <el-form-item label="录入方式" prop="methods" required>
        <el-radio-group v-model="ruleForm.methods">
          <el-radio label="1">人工录入</el-radio>
          <el-radio label="3">文件录入</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item
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
      </el-form-item> -->
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
      <el-form-item label="数量" prop="out_nums" required>
        <el-input-number
          v-model="ruleForm.out_nums"
          :min="1"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="经办人" prop="agent" required>
        <el-input
          v-model="ruleForm.agent"
          placeholder="请输入经办人"
        ></el-input>
      </el-form-item> -->
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
      ruleForm: {
        product_id: '',
        // methods: '1',
        out_nums: 1,
        date: ''
      },
      rules: {
        product_id: [{ required: true, message: '请选择', trigger: 'blur' }],
        date: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      // file: null,
      // fileList: [],
      productList: []
    }
  },
  created () {
    this.fetchProductList()
  },
  methods: {
    fetchProductList () {
      this.$axios.get('/product/list').then(res => {
        this.productList = res
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post('/product/chuku', {
              ...this.ruleForm
            })
            .then(res => {
              console.log(res)
            })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
    // beforeFileUpload (file) {
    //   this.file = file
    //   const isExcel =
    //     file.type ===
    //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isExcel) {
    //     this.$message.error('上传文件只能是excel')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传文件大小不能超过 2MB!')
    //   }
    //   return isExcel && isLt2M
    // },
    // uploadFile () {
    //   let formData = new FormData()
    //   formData.append('excelFile', this.file)
    //   this.$axios
    //     .post('/readExcel', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data; charset=utf-8'
    //       }
    //     })
    //     .then(res => {
    //       if (res.success) {
    //         const { date, product_name, product_nums, product_agent } = res.data
    //         this.ruleForm = {
    //           product_id: product_id || '',
    //           methods: '3',
    //           product_nums: product_nums || 1,
    //           date: date || '',
    //           product_agent: product_agent || ''
    //         }
    //       }
    //     })
    // },
    // handleFileListChange (file, fileList) {
    //   this.fileList = fileList.slice(-1)
    // },
    // loadDemo () {
    //   this.$axios.get('/product/chuku/loadDemo')
    // },
    // handleFileRemove () {
    //   this.ruleForm = {
    //     ...this.ruleForm,
    //     product_name: '',
    //     methods: '3',
    //     product_nums: 1,
    //     date: '',
    //     product_agent: ''
    //   }
    // }
  }
}
</script>
