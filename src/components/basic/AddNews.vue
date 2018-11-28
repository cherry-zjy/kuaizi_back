<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/News' }">新闻列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增新闻</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <el-form-item label="标题" prop="Title">
          <el-input v-model="getList.Title"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="Image">
          <el-upload v-model="getList.Image" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width:300px;">
            <img v-else src="../../../static/images/shangchuantupian.png" style="width:500px" />
          </el-upload>
        </el-form-item>
        <el-form-item label="适用范围" prop="Type">
          <el-radio-group v-model="getList.Type">
            <el-radio label="0">公司动态 </el-radio>
            <el-radio label="1">行业动态</el-radio>
            <el-radio label="2">媒体聚焦</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息内容" prop="defaultMsg">
          <UEditor :defaultMsg='defaultMsg' :config='config' ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getList')">新增</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
  import qs from "qs";
  import UEditor from "../UEditor";
  export default {
    data() {
      var checkdefaultMsg = (rule, value, callback) => {
        if (encodeURIComponent(this.$refs.ueditor.getUEContent()) == '') {
          callback(new Error("请输入内容"));
        } else {
          callback();
        }
      };
      var checkLogo = (rule, value, callback) => {
        if (this.imageUrl == '') {
          callback(new Error("请上传图片"));
        } else {
          callback();
        }
      };
      return {
        getList: [],
        dialogFormVisible: false,
        imageUrl: '',
        mainurl: '',
        action: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        defaultMsg: "",
        rules: {
          URL: [{
            required: true,
            message: '请输入跳转地址',
            trigger: 'blur'
          }, ],
          Image: [{
            required: true,
            validator: checkLogo
          }],
          Type: [{
            required: true,
            message: '请选择适用范围',
            trigger: 'change'
          }],
          defaultMsg: [{
            required: true,
            validator: checkdefaultMsg
          }],
        },
        find: false
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.action = this.mainurl + "/api/Back/UpdateForImage?type=0";
    },
    components: {
      UEditor
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.getList.Image = res.Result;
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            var content = this.$refs.ueditor.getUEContent();
            this.$http
              .post("api/Back/AddNews",
                qs.stringify({
                  image: this.getList.Image,
                  Type: this.getList.Type,
                  Token: getCookie("token"),
                  Title:this.getList.Title,
                  Content:encodeURIComponent(content),
                })
              )
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
                    setTimeout(() => {
                      this.$router.push({
                        path: "/News"
                      });
                    }, 1500);
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
      editimg(index) {
        this.editForm = this.list[index]
        this.imageUrl = this.mainurl + this.list[index].Logo
        this.dialogFormVisible = true
      },
      handleAdd(index, row) {
        this.$router.push("/AddMessage");
      },
      handleEdit(id) {
        this.$router.push("/EditMessage/id=" + id);
      }

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
    padding: 20px 0px;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-input {
    width: 50%;
  }

</style>
