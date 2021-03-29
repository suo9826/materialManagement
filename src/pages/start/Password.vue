<template>
  <span>
    <el-dialog
      :close-on-click-modal="false"
      width="550px"
      @close="handleCanel()"
      title="修改密码"
      :visible.sync="visible"
    >
      <el-form
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :model="ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="username" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCanel('ruleForm')">暂不修改</el-button>
        <el-button type="primary" @click="handleSubmit('ruleForm')"
          >确认修改</el-button
        >
      </div>
    </el-dialog>
  </span>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dialogVisible(newValue) {
      this.visible = newValue;
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      username: "",
      visible: this.dialogVisible,
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePass, trigger: "change" },
          {
            min: 8,
            max: 16,
            message: "密码长度在8-16位之间"
          }
        ],
        checkPass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: validatePass2, trigger: "change" }
        ]
      },
      userInfo: {}
    };
  },
  created() {
    this.$axios.get("/user/info").then(res => {
      this.userInfo = res;
      this.username = res.user_name;
    });
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`/user/update`, {
              ...this.userInfo,
              user_password: this.ruleForm.pass
            })
            .then(res => {
              if (res.success) {
                this.handleCanel("ruleForm");
                this.$message.success("修改成功,即将跳到登陆页面,请重新登录");
                setTimeout(() => {
                  this.$router.push("/sign");
                }, 1000);
              }
            });
        } else {
          return false;
        }
      });
    },
    handleCanel(formName) {
      this.$refs[formName].resetFields();
      this.$emit("onCancel");
    }
  }
};
</script>
<style scoped></style>
