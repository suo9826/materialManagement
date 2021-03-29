<template>
  <div class="container">
    <div class="login">
      <p style="color: #fff;font-size:26px">基于多源异构的MES物料管理系统</p>
      <el-form
        class="loginForm"
        ref="loginForm"
        label-position="right"
        label-width="40px"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item prop="name">
          <el-input
            placeholder="用户名"
            v-model="ruleForm.name"
            autocomplete="off"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            placeholder="密码"
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            placeholder="确认密码"
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 280px"
            type="primary"
            @click="submitForm('loginForm')"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item class="footertext">
          <span>
            已经注册？
            <router-link style="color:#409EFF" to="/sign">点击登录</router-link>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.loginForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      url: "",
      ruleForm: {
        nsme: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "change" }],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "change" },
          {
            min: 8,
            max: 16,
            message: "密码长度在8-16位之间"
          }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { name, pass } = this.ruleForm;
          this.$axios
            .post("/user/create", {
              user_name: name,
              user_password: pass
            })
            .then(res => {
              if (res.success) {
                this.$message.success("注册成功，即将跳转到登录页面");
                setTimeout(() => {
                  this.$router.push("/sign");
                }, 1000);
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.container {
  background-image: url("../../assets/imgs/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  position: relative;
}
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loginForm {
  width: 340px;
}
.el-input {
  width: 280px;
}
.footertext {
  text-align: center;
  width: 320px;
  color: white;
}
</style>
