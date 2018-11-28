<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">普通用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table 内容 -->
    <el-row>
      <el-form :model="List" ref="List" label-width="150px" class="demo-editForm" :label-position="labelPosition">
        <el-col :span="12">
          <p class="title">基本信息</p>
          <el-form-item label="用户头像">
            <img :src="mainurl+List.Image" class="avatar" width="200">
          </el-form-item>
          <el-form-item label="用户名">
            {{List.NickName}}
          </el-form-item>
          <el-form-item label="联系电话">
            {{List.Phone}}
          </el-form-item>
          <el-form-item label="推荐人">
            {{List.Referee}}
          </el-form-item>
          <el-form-item label="性别">
            {{List.Sex}}
          </el-form-item>
          <el-form-item label="经纪人">
            {{List.Agent}}
          </el-form-item>
          <el-form-item label="账户余额（元）">
            {{List.Money}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="title">实名信息</p>
          <el-form-item label="姓名：">
            {{List.Name}}
          </el-form-item>
          <el-form-item label="身份证号">
            {{List.IDcard}}
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
          .get("api/Back/Userdetails", {
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
                this.List = response.data.Result;
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
