<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.Query" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo()">查询</el-button>
        </el-form-item>
        <el-button type="primary" @click="handleAdd()" style="float:right;">新增</el-button>
      </el-form>
      
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="企业名" prop="Name">
      </el-table-column>
      <el-table-column label="企业图" prop="Logo">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Logo" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="工作内容" prop="Workstyle">
      </el-table-column>
      <el-table-column label="补贴（元）" prop="Subsidy">
      </el-table-column>
      <el-table-column label="经纪人" prop="WorkStore">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
          Query: ""
        },
        mainurl:''
      }
    },
    methods: {
      /*
             1、获取管理员列表 渲染列表
             2、格式化时间
             3、格式化是否锁定
             4、分页
          */
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back/QueryEnterprise", {
            params: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              Query:(this.filters.Query == '') ? '-1' : this.filters.Query,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if(status === 1){
                this.List = response.data.Result.list;
                this.pageCount = response.data.Result.page;
              }
              else if (status === 40001) {
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
              }
              else {
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

      //删除
      handleDel(id){
        this.$confirm('确认删除该企业?', '提示', {
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
            .get("api/Back/DelEnterprise", {
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

      handleEdit(index, row) {
        var obj = Object.assign({}, row);
        console.log(obj);
        var urlId = obj.ID;
        this.$router.push("/work/editcompany/id=" + urlId);
      },
      handleAdd() {
        this.$router.push("/work/addcompany");
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
