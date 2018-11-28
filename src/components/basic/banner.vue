<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>今日推荐</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true' v-if="!edit">
      <el-table-column label="企业名称" prop="WorkName">
      </el-table-column>
      <el-table-column label="banner图" prop="Image">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-col :span="16" v-else class="editform">
      <el-form :model="editForm" :rules="listrules" ref="editForm" label-width="150px" class="demo-editForm" label-position="left">
        <el-form-item label="banner图：">
          <el-upload v-model="editForm.Image" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转企业：" prop="WorkName">
          <el-select v-model="editForm.WorkName" placeholder="请选择跳转企业">
            <el-option v-for="item in storeList" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
          </el-select>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" class="centerbtn" @click="submitList('editForm')">确定</el-button>
          <el-button type="primary" class="centerbtn" @click="backlist()">返回</el-button>
        </div>
      </el-form>
    </el-col>
  </div>
</template>
<script>
  import md5 from "js-md5";

  export default {
    data() {
      return {
        List: [],
        storeList: [],
        filters: {
          Query: ""
        },
        //banner大图url
        imageUrl: '',
        mainurl: '',
        edit: false,
        action: '',
        listrules: {
          WorkName: [{
            required: true,
            message: '请选择企业',
            trigger: 'change'
          }],
        },
      };
    },
    methods: {
      backlist(){
        this.getInfo();
        this.edit = false;
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back/QueryBanner", {
            params: {
              Query: (this.filters.Query == '') ? '-1' : this.filters.Query,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.list;
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
      getstore() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取详情
        this.$http
          .get("api/Back/QueryEnterprise", {
            params: {
              pageIndex: 1,
              pageSize: 999,
              Query: -1,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.storeList = response.data.Result.list;
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
      handleEdit(index, row) {
        this.edit = true;
        this.editForm = this.List[0];
        this.imageUrl = this.mainurl+this.List[0].Image;
        this.getstore()
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.editForm.Image = res.Result[0];
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      // 保存
      submitList(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              var para = Object.assign({}, this.editForm);
              if(para.WorkName == this.List[0].WorkName){
                for (let i = 0; i < this.storeList.length; i++) {
                  if (this.storeList[i].Name == para.WorkName) {
                    para.WorkName = this.storeList[i].ID
                  }
                }
              }
              // 发保存请求
              this.$http
                .get("api/Back/EditBanner", {
                  params: {
                    Image: para.Image,
                    WorkID: para.WorkName,
                    Token: getCookie("token"),
                    BannerID:para.ID,
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
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    },
    
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
      this.action = this.mainurl + "/api/Back/UpdateForImage";
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

  .editform {
    margin: 50px;
  }

  .el-table {
    margin: 50px 0;
  }
  .btn{
    margin-top: 50px;
  }

</style>
