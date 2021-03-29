<template>
  <el-card class="charts">
    <div slot="header" class="clearfix">
      <span>最近10条出入库记录</span>
      <i class="el-icon-refresh" style="float:right" @click="handleFresh"></i>
    </div>
    <el-table
      :header-cell-style="{ background: 'rgb(238, 238, 238)' }"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="300px"
      v-loading="loading"
    >
      <el-table-column
        label="时间"
        min-width="200px"
        prop="time"
        show-overflow-tooltip
      >
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$axios.get("/records").then(res => {
        this.loading = false;
        if (res.data.success) {
          this.tableData = res.data.data;
        }
      });
    },
    handleFresh() {
      this.fetchData();
    }
  }
};
</script>
