<template>
  <div id="app">
    <el-container>
      <el-header height="50px">
        <span>基于多源异构的MES物料管理系统</span>
        <i
          class="el-icon-s-fold"
          v-if="!isCollapse"
          @click="isMenuCollapse(true)"
        ></i>
        <i class="el-icon-s-unfold" v-else @click="isMenuCollapse(false)"></i>
        <el-dropdown style="float:right" @command="handleCommand">
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="iconfont icon-mima_huaban1"
              command="password"
              >修改密码
            </el-dropdown-item>
            <el-dropdown-item icon="iconfont icon-tuichu" command="signOut"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeUrl"
            @open="handleOpen"
            @close="handleClose"
            background-color="rgb(41, 61, 79)"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
          >
            <!-- :collapse="isCollapse" -->
            <el-menu-item index="/home" :route="{ path: '/home' }">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/user">
              <i class="el-icon-menu"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>物料管理</span>
              </template>
              <el-menu-item index="/bigclass">
                <i class="el-icon-setting"></i>
                <span slot="title">大类</span>
              </el-menu-item>
              <el-menu-item index="/smallclass">
                <i class="el-icon-setting"></i>
                <span slot="title">小类</span>
              </el-menu-item>
              <el-menu-item index="/push">
                <i class="el-icon-setting"></i>
                <span slot="title">入库</span>
              </el-menu-item>
              <el-menu-item index="/out">
                <i class="el-icon-setting"></i>
                <span slot="title">出库</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/stockManage">
              <i class="el-icon-document"></i>
              <span slot="title">库存</span>
            </el-menu-item>
            <el-menu-item index="/supplier">
              <i class="el-icon-setting"></i>
              <span slot="title">供应商</span>
            </el-menu-item>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>报表</span>
              </template>
              <el-menu-item index="/put-report">
                <i class="el-icon-setting"></i>
                <span slot="title">入库记录</span>
              </el-menu-item>
              <el-menu-item index="/out-report">
                <i class="el-icon-setting"></i>
                <span slot="title">出库记录</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <password
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      @onSubmit="handleSubmit(value)"
      @onCancel="resetVisible()"
    />
  </div>
</template>

<script>
import Password from './start/Password'
export default {
  name: 'App',
  components: {
    Password
  },
  data () {
    return {
      dialogVisible: false,
      isCollapse: false,
      activeUrl: '/home'
    }
  },
  created () {
    this.activeUrl = this.$route.path
    this.url = 'http://39.105.68.212/yanzheng?' + 'a=' + Math.random()
  },
  methods: {
    isMenuCollapse (collapse) {
      this.isCollapse = collapse
      console.log('collapse', collapse)
    },
    handleCommand (command) {
      switch (command) {
        case 'password':
          this.dialogVisible = true
          break
        case 'signOut':
          this.$router.push('/sign')
          break
        default:
          return null
      }
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleSubmit (value) {
      this.resetVisible()
      this.$axios
        .post('/user/password', {
          password: value
        })
        .then(res => {
          console.log(res)
        })
    },
    resetVisible () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
i {
  cursor: pointer;
}
.el-header {
  background-color: rgb(41, 61, 79);
  color: rgb(243, 240, 240);
  text-align: left;
  line-height: 50px;
}

.el-aside {
  background-color: rgb(41, 61, 79);
  color: rgb(243, 240, 240);
  height: calc(100vh - 50px);
  font-size: 12px;
  line-height: 36px;
}
.el-menu {
  border-right: 1px;
}
.el-submenu__title,
.el-menu-item,
.el-submenu .el-menu-item,
.el-menu-item span {
  /* height: 36px;
  line-height: 36px; */
  font-size: 12px;
}
.el-main {
  background-color: rgb(212, 221, 230);
  color: #333;
  padding: 15px;
  overflow: auto;
  height: calc(100vh - 50px);
  /* text-align: center; */
  /* line-height: 160px; */
}
.el-dropdown-link {
  cursor: pointer;
  color: rgb(243, 240, 240);
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
