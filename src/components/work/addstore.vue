<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/store' }">门店列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加门店</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table 内容 -->
    <el-row>
      <el-form :model="editForm" :rules="listrules" ref="editForm" label-width="150px" class="demo-editForm" :label-position="labelPosition">
        <el-col :span="16">
          <p class="title">线下门店详情</p>
          <el-form-item label="门店大图：" prop="Image">
            <el-upload v-model="editForm.Image" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="门店名：" prop="Name">
            <el-input v-model="editForm.Name"></el-input>
          </el-form-item>
          <el-form-item label="经纪人：" prop="Phone">
            <el-select v-model="editForm.Phone" placeholder="请选择经纪人">
              <el-option v-for="item in phoneList" :key="item.Phone" :label="item.Name" :value="item.Phone"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店地址：">
            <BaiDuMap :mapmsg="locationMsg" ref="map"></BaiDuMap>
          </el-form-item>
          <el-form-item label="工作时间" prop="Intro">
            <el-input v-model="editForm.Intro"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <center>
      <el-button type="primary" @click="back()" class="centerbtn">返回</el-button>
      <el-button type="primary" @click="submitList('editForm')" class="centerbtn">保存</el-button>
    </center>
  </div>
</template>
<script>
  import BaiDuMap from "../BaiDuMap.vue"; //在页面中引入地图
  import qs from "qs";
  export default {
    components: {
      BaiDuMap
    },
    data() {
      return {
        editForm: {},
        phoneList: {},
        mainurl: "",
        action: '',
        labelPosition: 'left',
        //企业大图url
        imageUrl: '',
        //企业标签
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        //全局表单验证
        listrules: {
          Name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          Intro: [{
            required: true,
            message: '请输入工作时间',
            trigger: 'blur'
          }],
          Phone: [{
            required: true,
            message: '请选择经纪人',
            trigger: 'change'
          }],
        },
        locationMsg: {
          keyword: "",
          lnglat: "",
          address: ""
        }
      };
    },
    computed: {
      userid: function () {
        return window.location.href.split("id=")[1]
      }
    },
    beforeMount() {
      this.getagent();
    },
    mounted() {
      this.mainurl = mainurl;
      this.action = this.mainurl + "/api/Back/UpdateForImage";
    },
    methods: {
      getagent() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取详情
        this.$http
          .get("api/Back/QueryUser", {
            params: {
              pageIndex: 1,
              pageSize: 999,
              Query: -1,
              Type: 1,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.phoneList = response.data.Result.list;
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
        this.$router.push("/store");
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
      if (this.$refs.map.locationMsg.lnglat == "") {
        this.$message({
          message: "警告哦，请先地图选点获取经纬度地址",
          type: "warning"
        });
      } else {
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
              // 将token传入参数中
              para.Token = getCookie("token");
              para.Adress = this.$refs.map.locationMsg.address;
              para.Longitude = this.$refs.map.locationMsg.lnglat.split(",")[0];
              para.Latitude = this.$refs.map.locationMsg.lnglat.split(",")[1];
              // 发保存请求
              this.$http
                .get("api/Back/AddStore", {
                  params: {
                    Image: para.Image,
                    Name: para.Name,
                    Phone: this.editForm.Phone,
                    Adress: para.Adress,
                    Longitude: para.Longitude,
                    Latitude: para.Latitude,
                    Intro:para.Intro,
                    Token: getCookie("token"),
                  }
                })
                .then(
                  function(response) {
                    loading.close();
                    var status = response.data.Status;
                    if (status === 1) {
                      this.$message({
                        showClose: true,
                        type: "success",
                        message: response.data.Result
                      });
                      this.back()
                      // 表单重置
                      this.$refs["editForm"].resetFields();
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
                  function(error) {
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
      }
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
