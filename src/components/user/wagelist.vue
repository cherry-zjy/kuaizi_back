<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>工资列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo()">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary">导入工资条</el-button>
          <input id="file" type="file" @change="FileIn()" />
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="真实姓名" prop="Name">
      </el-table-column>
      <el-table-column label="工牌号" prop="WorkingGrade">
      </el-table-column>
      <el-table-column label="公司名称" prop="CompanyName">
      </el-table-column>
      <el-table-column label="工时" prop="WorkingHours">
      </el-table-column>
      <el-table-column label="单价" prop="UnitPrice">
      </el-table-column>
      <el-table-column label="餐补" prop="MealSupplement">
      </el-table-column>
      <el-table-column label="工资" prop="Wages">
      </el-table-column>
      <el-table-column label="借支" prop="Borrow">
      </el-table-column>
      <el-table-column label="其他补贴" prop="OtherSubsidies">
      </el-table-column>
      <el-table-column label="个人所得税" prop="IncomeTax">
      </el-table-column>
      <el-table-column label="其他扣款" prop="OtherDeductions">
      </el-table-column>
      <el-table-column label="应发工资" prop="SalaryPayable">
      </el-table-column>
      <el-table-column label="实发工资" prop="RealWages">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDel(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        List: [], //管理员角色列表
        // 搜索关键字
        filters: {
          keyword: "",
        },
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
          .get("api/Back/wages", {
            params: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              Name: (this.filters.keyword == '') ? '-1' : this.filters.keyword,
              Token: getCookie("token"),
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
      //导入工资条
      FileIn() {
        const loadingDR = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        var formdata = new FormData();
        formdata.append("file", $("#file")[0].files[0]); //获取文件法二
        this.$http
          .post(
            "api/Back/Import",
            formdata
            // qs.stringify({
            //   params: formdata
            // })
            // ,
            // {
            //   headers: { "Content-Type": "application/octet-stream" }
            // } //添加请求头
          )
          .then(
            function (response) {
              loadingDR.close();
              var status = response.data.Status;
              if (status === 1) {
                this.getInfo();
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "导入成功"
                });
              } else if (status === -1) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: "请不要重复导入"
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loadingDR.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      handleDel(id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http
            .get("api/Back/DelSalary", {
              params: {
                Token: getCookie("token"),
                ID: id,
              }
            })
            .then(
              function (response) {
                loading.close();
                var status = response.data.Status;
                if (status === 1) {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: response.data.Result
                  });
                  this.getInfo()
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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

  #file{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

</style>
