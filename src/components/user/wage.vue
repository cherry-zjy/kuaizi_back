<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">普通用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>工资信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table 内容 -->
    <el-row>
      <el-form :model="List" ref="List" label-width="150px" class="demo-editForm" :label-position="labelPosition">
        <el-col :span="12">
          <p class="title">工资明细</p>
          <el-form-item label="工时">
            {{List.WorkingHours}}
          </el-form-item>
          <el-form-item label="单价">
            {{List.UnitPrice}}
          </el-form-item>
          <el-form-item label="餐补">
            {{List.MealSupplement}}
          </el-form-item>
          <el-form-item label="工资">
            {{List.Wages}}
          </el-form-item>
          <el-form-item label="借支">
            {{List.Borrow}}
          </el-form-item>
          <el-form-item label="其他补贴">
            {{List.OtherSubsidies}}
          </el-form-item>
          <el-form-item label="个人所得税">
            {{List.IncomeTax}}
          </el-form-item>
          <el-form-item label="其他扣款">
            {{List.OtherDeductions}}
          </el-form-item>
          <el-form-item label="应发工资">
            {{List.SalaryPayable}}
          </el-form-item>
          <el-form-item label="实发工资">
            {{List.RealWages}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="title">基本信息</p>
          <el-form-item label="真实姓名">
            {{List.NickName}}
          </el-form-item>
          <el-form-item label="工牌号">
            {{List.Phone}}
          </el-form-item>
          <el-form-item label="公司名称">
            {{List.Referee}}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <center>
      <el-button type="primary" @click="back()" class="centerbtn">返回</el-button>
    </center>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        List: {},
        mainurl: "",
        labelPosition: 'left',
      };
    },
    beforeMount() {
      this.getInfo();
    },
    mounted() {
      this.mainurl = mainurl;
    },
    methods: {
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取详情
        this.$http
          .get("api/Back/wages", {
            params: {
              Token: getCookie("token"),
              IDcard: window.location.href.split("id=")[1],
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.list[0];
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
              //   this.$notify.error({
              //     title: "错误",
              //     message: "错误：请检查网络"
              //   });
            }.bind(this)
          );
      },
      back() {
        this.$router.push("/user");
      },
    },

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

  .el-row {
    padding: 20px 50px;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .el-input {
    width: 50%;
  }

  .el-textarea {
    width: 50%;
  }

  .el-table {
    width: 50%;
  }

</style>
