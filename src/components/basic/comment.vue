<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="handleAdd()" style="float:right;margin-bottom: 20px;">新增</el-button>

    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="姓名" prop="Name">
      </el-table-column>
      <el-table-column label="所属部门" prop="Position">
      </el-table-column>
      <el-table-column label="优秀" prop="Fcmy1">
      </el-table-column>
      <el-table-column label="良好" prop="Fcmy2">
      </el-table-column>
      <el-table-column label="好" prop="Fcmy3">
      </el-table-column>
      <el-table-column label="勉强" prop="Fcmy4">
      </el-table-column>
      <el-table-column label="不满意" prop="Fcmy5">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDel(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" center>
      <el-form :model="addForm" :rules="addrules" ref="addForm" label-width="150px" class="demo-editForm" label-position="left">
        <el-form-item label="头像：" prop="Image">
          <el-upload v-model="addForm.Image" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200">
            <img v-else src="../../../static/images/add.png">
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名：" prop="Name">
          <el-input v-model="addForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="职位：" prop="Position">
          <el-input v-model="addForm.Position"></el-input>
        </el-form-item>
        <el-form-item label="身份：" prop="Type">
          <el-radio-group v-model="addForm.Type">
            <el-radio :label="0">用户</el-radio>
            <el-radio :label="1">经纪人</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="apply('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialogFormVisible1" center>
      <el-form :model="editform" :rules="addrules" ref="editform" label-width="150px" class="demo-editForm" label-position="left">
        <el-form-item label="头像：" prop="Image">
          <el-upload v-model="editform.Image" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200">
            <img v-else src="../../../static/images/add.png">
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名：" prop="Name">
          <el-input v-model="editform.Name"></el-input>
        </el-form-item>
        <el-form-item label="职位：" prop="Position">
          <el-input v-model="editform.Position"></el-input>
        </el-form-item>
        <el-form-item label="身份：" prop="Type">
          <el-radio-group v-model="editform.Type">
            <el-radio :label="0">用户</el-radio>
            <el-radio :label="1">经纪人</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="edit('editform')">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    data() {
      var checkLogo = (rule, value, callback) => {
        if (this.imageUrl == '') {
          callback(new Error("请上传图片"));
        } else {
          callback();
        }
      };
      return {
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        List: [], //管理员角色列表
        editform:[],
        mainurl: '',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        imageUrl: '',
        action: '',
        addForm: {
          Image: '',
          Name: '',
          Position: '',
          Type: ''
        },
        addrules: {
          Name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          Position: [{
            required: true,
            message: '请输入职位',
            trigger: 'blur'
          }],
          Image: [{
            required: true,
            validator: checkLogo
          }],
          Type: [{
            required: true,
            message: '请选择身份',
            trigger: 'change'
          }],
        },
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
          .get("api/Back/EvaluateList", {
            params: {
              Token: getCookie("token"),
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
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      Time(row) {
        var Time = row.Time;
        Time = Time.substring(0, 10);
        return Time
      },
      apply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .get("api/Back/AddEvaluate", {
                params: {
                  Token: getCookie("token"),
                  Image: this.addForm.Image,
                  Name: this.addForm.Name,
                  Position: this.addForm.Position,
                  Type: this.addForm.Type
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
                    this.dialogFormVisible = false
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleEdit(row){
        console.log(row)
        this.editform = row;
        this.imageUrl = mainurl+row.Image;
        this.dialogFormVisible1 = true
      },
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .get("api/Back/EditEvaluate", {
                params: {
                  Token: getCookie("token"),
                  Image: this.editform.Image,
                  Name: this.editform.Name,
                  Position: this.editform.Position,
                  ID:this.editform.ID,
                  Type: this.editform.Type
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
                    this.dialogFormVisible1 = false
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleAdd() {
        this.imageUrl = ""
        this.dialogFormVisible = true;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.addForm.Image = res.Result[0];
        this.editform.Image = res.Result[0];
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      //删除
      handleDel(id){
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
            .get("api/Back/DelEvaluate", {
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
      this.action = this.mainurl + "/api/Back/UpdateForImage";
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
