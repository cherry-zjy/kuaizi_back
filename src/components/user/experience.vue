<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">普通用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>工作经历</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="公司名称" prop="Name">
      </el-table-column>
      <el-table-column label="月综合薪资（元）" prop="MonthSalary">
      </el-table-column>
      <el-table-column label="入职时间" prop="StartTime" :formatter="StartTime">
      </el-table-column>
      <el-table-column label="离职时间" prop="EndTime" :formatter="EndTime">
      </el-table-column>
      <el-table-column label="服务商" prop="Server" :formatter="servere">
      </el-table-column>
      <el-table-column label="工牌" prop="WorkCard">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.WorkCard" width="200" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <center>
      <el-button type="primary" @click="back()" class="centerbtn">返回</el-button>
    </center>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        List: [], 
        mainurl: '',
      }
    },
    methods: {
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back/Experience", {
            params: {
              Token: getCookie("token"),
              ID: window.location.href.split("id=")[1],
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.list;
                this.pageCount = response.data.Result.page;
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else {
                loading.close();
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      back() {
        this.$router.push("/user");
      },
      StartTime(row) {
        var StartTime = row.StartTime;
        StartTime = StartTime.substring(0, 10);
        return StartTime
      },
      EndTime(row) {
        var EndTime = row.EndTime;
        EndTime = EndTime.substring(0, 10);
        return EndTime
      },
      servere(row){
        var Server = row.Server;
        if(Server == -1){
          Server = ''
        }
        return Server
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
    }
  };

</script>
<style scoped>
  /* 面包屑 */

  .crumb {
    height: 36px;
    line-height: 36px;
  }

  .block {
    text-align: center;
    padding: 20px 0;
  }

</style>
