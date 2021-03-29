<template>
  <div class="container">
    <div class="toolbar">
      <el-button
        @click="onCreate"
        icon="el-icon-plus"
        size="small"
        :disabled="this.level === 1"
      >
        新建
      </el-button>
      <el-button
        :disabled="selection.length === 0 || this.level === 1"
        icon="el-icon-delete"
        size="small"
        @click="handleDelete"
      >
        删除
      </el-button>
      <common-search @onSearch="handleSearch"></common-search>
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
    >
      <el-table-column :selectable="checkSelect" type="selection" width="55">
      </el-table-column>
      <el-table-column label="用户名" min-width="200px" prop="user_name">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="onUpdate(scope.row)"
          >
            {{ scope.row.user_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_level"
        min-width="150px"
        label="权限"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatterUserLevel(scope.row.user_level) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        min-width="150px"
        label="状态"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === 1"
            key="tag1"
            type="success"
            effect="dark"
            size="small"
          >
            正 常
          </el-tag>
          <el-tag size="small" v-else key="tag2" type="danger" effect="dark">
            冻 结
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" prop="time" label="创建时间">
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
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="ruleForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input
            type="password"
            v-model="ruleForm.user_password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="user_checkPass">
          <el-input
            type="password"
            v-model="ruleForm.user_checkPass"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="user_level">
          <el-select
            :disabled="this.level !== 3"
            v-model="ruleForm.user_level"
            placeholder="请选择"
          >
            <el-option key="normalUser" label="普通用户" :value="1"></el-option>
            <el-option
              key="normalAdmin"
              label="普通管理员"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            :disabled="!this.editable"
            v-model="ruleForm.status"
            placeholder="请选择"
          >
            <el-option key="normal" label="正常" :value="1"> </el-option>
            <el-option key="freeze" label="冻结" :value="0"> </el-option>
          </el-select>
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
import Alert from "@/components/Alert";
import CommonSearch from "../components/CommonSearch.vue";
import { isEqual, cloneDeep } from "lodash";
export default {
  components: {
    Alert,
    CommonSearch
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.user_checkPass !== "") {
          this.$refs.ruleForm.validateField("user_checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.user_password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      currentPage: 1,
      action: "create",
      dialogtitle: "新建用户",
      filter: "",
      visible: false,
      ruleForm: {
        user_name: "",
        user_password: "",
        user_level: 1,
        status: 1,
        user_checkPass: ""
      },
      rules: {
        user_name: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        user_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "change" },
          {
            min: 8,
            max: 16,
            message: "密码长度在8-16位之间"
          }
        ],
        user_checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "change" }
        ],
        user_level: [
          { required: true, message: "请选择权限", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      selection: [],
      tableData: [],
      editable: false,
      level: 1,
      userInfo: {}
    };
  },
  created() {
    this.fetchData();
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      this.$axios.get("/user/info").then(res => {
        this.userInfo = res;
        console.log(123, this.userInfo);
        this.level = res.user_level;
      });
    },
    fetchData(extraParams = {}, isReset = false) {
      this.loading = true;
      const params = {
        pageNum: this.currentPage,
        filter: this.filter,
        ...extraParams
      };
      this.$axios.post("/user/list", params).then(res => {
        this.loading = false;
        if (res.success) {
          if (isReset) {
            this.resetTable();
          }
          let list = res.data.list;
          if (list.length > 10) {
            list.slice(0, 10);
          }
          this.tableData = list;
          this.total = res.data.total;
        }
      });
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    handleDelete() {
      this.$confirm("此操作将删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get("/user/delete", {
          params: {
            ids: this.selection.map(item => item.user_id)
          }
        });
      });
    },
    resetTable() {
      this.selection = [];
      this.currentPage = 1;
    },
    onUpdate(row) {
      this.action = "update";
      this.dialogtitle = "编辑用户";
      const newRuleForm = {
        ...this.ruleForm,
        ...row,
        user_checkPass: row.user_password
      };
      this.oldRuleForm = cloneDeep(newRuleForm);
      this.ruleForm = newRuleForm;
      this.editable = false;
      if (row.user_level < this.level) {
        this.editable = true;
      }
      this.visible = true;
    },
    onCreate() {
      this.action = "create";
      this.dialogtitle = "新建用户";
      this.ruleForm = {
        user_name: "",
        user_password: "",
        user_level: 1,
        status: 1,
        user_checkPass: ""
      };
      this.visible = true;
      this.editable = true;
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid, valuas) => {
        if (valid) {
          const { user_checkPass, time, ...restprops } = this.ruleForm;
          this.$axios
            .post(`/user/${this.action}`, {
              ...restprops
            })
            .then(res => {
              if (res.success) {
                this.visible = false;
                if (this.action === "update") {
                  if (
                    this.userInfo.user_id === this.ruleForm.user_id &&
                    !isEqual(this.oldRuleForm, this.ruleForm)
                  ) {
                    const msg = "编辑成功,即将跳到登陆页面,请重新登录";
                    this.$message.success(msg);
                    setTimeout(() => {
                      this.$router.push("/sign");
                    }, 1000);
                  } else {
                    this.fetchData();
                  }
                } else {
                  this.fetchData();
                }
              }
            });
        }
      });
    },
    handleCanel(formName) {
      this.visible = false;
      this.$refs[formName].resetFields();
    },
    handleSearch(filter) {
      this.filter = filter;
      this.currentPage = 1;
      this.fetchData({}, true);
    },
    handlePaginationChange(currentPage) {
      this.fetchData({}, false);
    },
    checkSelect(row, index) {
      return row.check;
    },
    formatterUserLevel(userLevel) {
      switch (userLevel) {
        case 1:
          return "普通用户";
        case 2:
          return "普通管理员";
        case 3:
          return "超级管理员";
        default:
          return "";
      }
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 320px;
}
</style>
