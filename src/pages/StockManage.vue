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
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="名称" min-width="200px">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="onUpdate(scope.row)"
          >
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        min-width="200px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="200px"
        label="地址"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        min-width="200px"
        label="联系电话"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="200px"
        prop="ower"
        label="创建人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column min-width="200px" prop="date" label="创建时间">
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
      widyh="550px"
      :visible.sync="visible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.number="ruleForm.phone"></el-input>
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
      dialogtitle: "新建供应商",
      filter: "",
      visible: false,
      ruleForm: {
        name: "",
        desc: "",
        address: "",
        phone: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        phone: [
          {
            type: "number",
            message: "请输入正确的电话格式",
            trigger: "change"
          },
          { required: true, message: "请输入电话", trigger: "blur" }
        ]
      },
      selection: [],
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan",
          pidName: "大类一",
          pid: 1
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          desc: "上海市普陀区金沙江路 1518 弄",
          ower: "suoyuan"
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData(extraParams = {}, isReset = false) {
      const params = {
        pageNum: 1,
        ...extraParams
      };
      this.$axios.post("/supplier/list", params).then(res => {
        if (res) {
          if (isReset) {
            this.resetTable();
          }
          this.tableData = res.data;
          this.total = res.total;
        }
      });
    },
    handleSelectionChange(selection) {
      console.log("selection", selection);
      this.selection = selection;
    },
    handleDelete() {
      this.$confirm("此操作将删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post("/supplier/delete", {
            ids: this.selection.map(item => {
              return { id: item.id, pid: item.pid };
            })
          })
          .then(res => {
            if (res) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
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
      this.dialogtitle = "编辑供应商";
      this.ruleForm = {
        ...this.ruleForm,
        ...row
      };
      this.visible = true;
    },
    onCreate() {
      this.action = "create";
      this.dialogtitle = "新建供应商";
      this.ruleForm = {
        name: "",
        desc: ""
      };
      this.visible = true;
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          this.$axios.post(`/supplier/${this.action}`, {
            ...this.ruleForm
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCanel(formName) {
      this.visible = false;
      this.$refs[formName].resetFields();
    },
    handleSearch(filter) {
      this.filter = filter;
      const params = {
        filter: filter,
        pageNum: 1
      };
      this.fetchData(params, true);
    },
    handlePaginationChange(currentPage) {
      const params = {
        filter: this.filter,
        pageNum: currentPage
      };
      this.fetchData(params, false);
    }
  }
};
</script>
