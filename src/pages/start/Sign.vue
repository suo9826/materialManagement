<template>
  <div class="container">
    <div class="sign">
      <p style="color: #fff; font-size: 26px">基于多源异构的MES物料管理系统</p>
      <el-form
        :hide-required-asterisk="true"
        class="signForm"
        ref="signForm"
        label-width="40px"
        :model="form"
        :rules="rules"
        @keyup.enter.native="submitForm('signForm')"
      >
        <el-form-item label="" prop="name">
          <el-input
            placeholder="用户名"
            prefix-icon="el-icon-user"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="el-icon-lock"
            type="password"
            clearable
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            class="codeInput"
            placeholder="验证码"
            v-model="form.code"
          ></el-input>
          <img
            class="code"
            :src="url"
            alt="图片走丢啦"
            title="点击重新获取"
            @click="getCode"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 280px"
            type="primary"
            @click="submitForm('signForm')"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="footertext">
          <span>
            还没注册？
            <router-link style="color: #409eff" to="/login"
              >点击注册</router-link
            >
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      url: "",
      form: {
        name: "",
        password: "",
        code: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 8,
            max: 16,
            message: "密码长度在8-16位之间"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created () {
    this.getCode();
  },
  methods: {
    getCode () {
      this.url = "http://39.105.68.212/yanzheng?" + "a=" + Math.random();
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const code = this.form.code.toUpperCase();
          this.$axios
            .post("/login", {
              user_name: this.form.name,
              user_password: this.form.password,
              yan: code
            })
            .then(res => {
              if (res.success) {
                this.$router.push("/home");
              } else {
                this.getCode();
                this.form.code = "";
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
body {
  margin: 0px;
}
.container {
  background-image: url('../../assets/imgs/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  position: relative;
}
.sign {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.signForm {
  width: 340px;
}
.el-input {
  width: 280px;
}
.codeInput {
  width: 130px;
  margin-right: 20px;
}
.code {
  width: 130px;
  height: 40px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
.footertext {
  text-align: center;
  width: 320px;
  color: white;
}
</style>
