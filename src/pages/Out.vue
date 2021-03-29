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
      <el-form-item label="录入方式" prop="methods" required>
        <el-radio-group v-model="ruleForm.methods">
          <el-radio label="1">人工录入</el-radio>
          <el-radio label="2">图片录入</el-radio>
          <el-radio label="3">文件录入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品名称" prop="name" required>
        <el-select
          filterable
          v-model="ruleForm.name"
          placeholder="请选择产品名称"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.date"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="数量" prop="num" required>
        <el-input-number v-model="ruleForm.num" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="经办人" prop="agent" required>
        <el-input
          v-model="ruleForm.agent"
          placeholder="请输入经办人"
        ></el-input>
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
      productList: [
        { id: 1, name: '产品1' },
        { id: 2, name: '产品2' }
      ],
      ruleForm: {
        methods: '1',
        name: '',
        num: 0,
        agent: '',
        date: ''
      },
      rules: {}
    }
  },
  created () {
    this.$axios.get('/product/list').then(res => {
      this.productList = res.data
    })
  },
  methods: {
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
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
