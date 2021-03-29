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
      v-loading="loading"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="名称" min-width="200px">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="onUpdate(scope.row)"
          >
            {{ scope.row.type_max }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="type_desc"
        label="描述"
        min-width="200px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pid_Name"
        min-width="200px"
        label="所属大类"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="150px"
        prop="owner"
        label="创建人"
        show-overflow-tooltip
      >
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
        <el-form-item label="大类" prop="pid">
          <el-select
            filterable
            v-model="ruleForm.type_pid"
            placeholder="请选择大类"
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

        <el-form-item label="名称" prop="type_max">
          <el-input v-model="ruleForm.type_max"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="type_desc">
          <el-input v-model="ruleForm.type_desc"></el-input>
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
export default {
  components: {
    Alert,
    CommonSearch
  },
  data() {
    return {
      total: 0,
      currentPage: 1,
      action: "create",
      dialogtitle: "新建小类",
      filter: "",
      visible: false,
      ruleForm: {
        type_max: "",
        type_desc: "",
        type_pid: ""
      },
      rules: {
        type_max: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type_pid: [{ required: true, message: "请选择大类", trigger: "blur" }]
      },
      selection: [],
      tableData: [],
      bigClassList: [],
      loading: false
    };
  },
  created() {
    this.fetchData();
    this.fetchBigClass();
  },
  methods: {
    fetchBigClass() {
      this.$axios.get("/type/getmax").then(res => {
        if (res) {
          this.bigClassList = res;
        }
      });
    },
    fetchData(extraParams = {}, isReset = false) {
      this.loading = true;
      const params = {
        type_pid: -1,
        pageNum: this.currentPage,
        filter: this.filter,
        ...extraParams
      };
      this.$axios.post("/type/gettype", params).then(res => {
        this.loading = false;
        if (res.success) {
          if (isReset) {
            this.resetTable();
          }
          this.tableData = res.data.list;
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
        this.$axios
          .get("/type/delete", {
            params: {
              ids: this.selection.map(item => item.type_id)
            }
          })
          .then(res => {
            if (res.success) {
              this.fetchData();
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
      this.dialogtitle = "编辑小类";
      this.ruleForm = {
        ...this.ruleForm,
        ...row
      };
      this.visible = true;
    },
    onCreate() {
      this.action = "create";
      this.dialogtitle = "新建小类";
      this.ruleForm = {
        type_max: "",
        type_desc: "",
        type_pid: ""
      };
      this.visible = true;
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let path = "/type/inserttype";
          if (this.action === "update") {
            path = "/type/updatetype";
          }
          this.$axios
            .post(path, {
              ...this.ruleForm
            })
            .then(res => {
              if (res.success) {
                this.visible = false;
                this.fetchData();
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
    handlePaginationChange() {
      this.fetchData({}, false);
    }
  }
};
</script>
