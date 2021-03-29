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
      <el-form-item label="录入方式" prop="methods" required>
        <el-radio-group v-model="ruleForm.methods">
          <el-radio label="1">人工录入</el-radio>
          <el-radio label="2">图片录入</el-radio>
          <el-radio label="3">文件录入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.methods === '2'"
        label="上传图片"
        prop="img"
        :required="ruleForm.methods === '2'"
      >
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.methods === '3'"
        label="上传文件"
        prop="file"
        :required="ruleForm.methods === '3'"
      >
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeFileUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传txt文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="大类" prop="max" required>
        <el-select filterable v-model="ruleForm.max" placeholder="请选择">
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小类" prop="small" required>
        <el-select filterable v-model="ruleForm.small" placeholder="请选择">
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="name" required>
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="时间" required>
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="ruleForm.date"
          style="width: 100%;"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="数量" prop="num" required>
        <el-input-number
          v-model="num"
          :min="1"
          label="描述文字"
        ></el-input-number>
        <!-- <el-input-number v-model="ruleForm.num" :min="1"></el-input-number> -->
      </el-form-item>
      <el-form-item label="单价" prop="singlePrice" required>
        <el-input-number
          :min="0.0"
          :precision="2"
          :step="0.1"
          v-model="ruleForm.singlePrice"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="总价格" prop="totalPrice" required>
        <el-input-number
          :min="0.0"
          :precision="2"
          :step="0.1"
          v-model="ruleForm.totalPrice"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="经办人" prop="agent" required>
        <el-input
          placeholder="请输入经办人"
          v-model="ruleForm.agent"
        ></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier" required>
        <el-select v-model="ruleForm.supplier" placeholder="请选择供应商">
          <el-option
            v-for="item in suppliers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
  data() {
    return {
      num: 1,
      productList: [
        { id: 1, name: "产品1" },
        { id: 2, name: "产品2" }
      ],
      suppliers: [
        { id: 1, name: "供应商1" },
        { id: 2, name: "供应商2" }
      ],
      ruleForm: {
        methods: "1",
        name: "",
        num: 1,
        singlePrice: 0,
        totalPrice: 0.0,
        agent: "",
        supplier: "",
        date: ""
      },
      rules: {},
      imageUrl: ""
    };
  },
  created() {
    this.$axios.get("/product/list").then(res => {
      this.productList = res.data;
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/product/ruku", {
              ...this.ruleForm
            })
            .then(res => {
              console.log(res);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    beforeFileUpload(file) {
      const isTXT = file.type === "text/plain";
      const isLt500KB = file.size / 1024 < 500;
      if (!isTXT) {
        this.$message.error("上传文件只能是 TXT 格式!");
      }
      if (!isLt500KB) {
        this.$message.error("上传文件大小不能超过 500KB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
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
</style>
