<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/company' }">企业列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改企业列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table 内容 -->
    <el-row>
      <el-form :model="editForm" :rules="listrules" ref="editForm" label-width="150px" class="demo-editForm" :label-position="labelPosition">
        <el-col :span="12">
          <p class="title">基本信息</p>
          <el-form-item label="企业名：" prop="Name">
            <el-input v-model="editForm.Name"></el-input>
          </el-form-item>
          <el-form-item label="企业图" prop="Logo">
            <el-upload v-model="editForm.Logo" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="补贴类型" prop="SubsidyType">
            <el-select v-model="editForm.SubsidyType" placeholder="请选择类型">
              <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="补贴金额（元）：" prop="Subsidy">
            <el-input v-model="editForm.Subsidy"></el-input>
          </el-form-item>
          <el-form-item label="企业标签：" prop="dynamicTags">
            <el-tag type='danger' :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
          </el-form-item>
          <el-form-item label="工作方式：" prop="Workstyle">
            <el-input v-model="editForm.Workstyle"></el-input>
          </el-form-item>
          <el-form-item label="发薪日：" prop="SalaryDate">
            <el-input v-model="editForm.SalaryDate"></el-input>
          </el-form-item>
          <el-form-item label="企业规划（人）：" prop="EnterprisePeople">
            <el-input v-model="editForm.EnterprisePeople"></el-input>
          </el-form-item>
          <el-form-item label="门店联系方式：" prop="WorkStore">
            <el-input v-model="editForm.WorkStore"></el-input>
          </el-form-item>
          <el-form-item label="是否加急" prop="IsBusy">
            <el-switch v-model="editForm.IsBusy"></el-switch>
          </el-form-item>

          <p class="title">企业轮播图</p>
          <el-form-item label="厂区：" prop="cqimg">
            <el-upload class="upload-demo" :action="action" :on-preview="handlePreview" :on-remove="cqhandleRemove" :file-list="cqimg"
              list-type="picture-card" :on-success="cqhandleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item label="伙食：" prop="eatimg">
            <el-upload class="upload-demo" :action="action" :on-preview="handlePreview" :on-remove="eathandleRemove" :file-list="eatimg"
              list-type="picture-card" :on-success="eathandleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="住宿：" prop="stayimg">
            <el-upload class="upload-demo" :action="action" :on-preview="handlePreview" :on-remove="stayhandleRemove" :file-list="stayimg"
              list-type="picture-card" :on-success="stayhandleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="工资条：" prop="wageimg">
            <el-upload class="upload-demo" :action="action" :on-preview="handlePreview" :on-remove="wagehandleRemove" :file-list="wageimg"
              list-type="picture-card" :on-success="wagehandleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="title">工资说明</p>
          <el-form-item label="综合薪资：" prop="Salary">
            <el-input v-model="editForm.Salary"></el-input>
          </el-form-item>
          <el-form-item label="住宿：" prop="SSStay">
            <el-input v-model="editForm.SSStay" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="底薪（元）：">
            <el-input v-model="editForm.BasicSalary"></el-input>
          </el-form-item>
          <el-form-item label="合同说明：" prop="Contract">
            <el-input v-model="editForm.Contract" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="薪资结构：">
            <el-input v-model="editForm.SalaryExplain" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="工资发放：" prop="PayMoney">
            <el-input v-model="editForm.PayMoney" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="伙食：" prop="SSEat">
            <el-input v-model="editForm.SSEat" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="保险说明：">
            <el-input v-model="editForm.Insurance" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="温馨提示：">
            <el-input v-model="editForm.Prompt" type="textarea" rows="5"></el-input>
          </el-form-item>
          <p class="title" style="width:50%">录用条件
            <el-button size="mini" type="danger" @click="dialogFormVisible = true" style="float:right">+</el-button>
          </p>

          <el-table :data="WorkRuler" style="width: 100%">
            <el-table-column prop="Title" width="180" label="条件">
            </el-table-column>
            <el-table-column prop="Content" width="180" label="内容">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, WorkRuler)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <p class="title">岗位说明</p>
          <el-form-item label="工作内容：" prop="WorkContent">
            <el-input v-model="editForm.WorkContent"></el-input>
          </el-form-item>
          <el-form-item label="两班倒：" prop="Changework">
            <el-input v-model="editForm.Changework"></el-input>
          </el-form-item>
          <el-form-item label="工资环境：" prop="WorkEnvir">
            <el-input v-model="editForm.WorkEnvir"></el-input>
          </el-form-item>
          <p class="title">企业说明</p>
          <el-form-item label="企业说明：">
            <el-input v-model="editForm.EnterpriseExplain" type="textarea" rows="8"></el-input>
            <!-- <el-input type="textarea" v-model="editForm.EnterpriseExplain"></el-input> -->
          </el-form-item>
          <el-form-item label="企业地址：">
            <el-input v-model="editForm.Adress"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <center>
      <el-button type="primary" @click="back()" class="centerbtn">返回</el-button>
      <el-button type="primary" @click="submitList('editForm')" class="centerbtn">保存</el-button>
    </center>
    <!-- 录用条件模态框 -->
    <el-dialog title="录用条件" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="Title">
          <el-input v-model="ruleForm.Title" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="条件" prop="Content">
          <el-input v-model="ruleForm.Content" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      var checkLogo = (rule, value, callback) => {
        if (this.imageUrl == '') {
          callback(new Error("请上传图片"));
        } else {
          callback();
        }
      };
      var checkcqimg = (rule, value, callback) => {
        if (this.cqimg.length == 0 && this.addcqimg.length == 0) {
          callback(new Error("请上传厂区图片"));
        } else {
          callback();
        }
      };
      var checkeatimg = (rule, value, callback) => {
        if (this.eatimg.length == 0 && this.addeatimg.length == 0) {
          callback(new Error("请上传伙食图片"));
        } else {
          callback();
        }
      };
      var checkstayimg = (rule, value, callback) => {
        if (this.stayimg.length == 0 && this.addstayimg.length == 0) {
          callback(new Error("请上传住宿图片"));
        } else {
          callback();
        }
      };
      var checkwageimg = (rule, value, callback) => {
        if (this.wageimg.length == 0 && this.addwageimg.length == 0) {
          callback(new Error("请上传工资条图片"));
        } else {
          callback();
        }
      };
      var checktag = (rule, value, callback) => {
        if (this.dynamicTags.length == 0) {
          callback(new Error("请添加企业标签"));
        } else {
          callback();
        }
      };
      return {
        editForm: {},
        mainurl: "",
        action: '',
        labelPosition: 'left',
        //企业大图url
        imageUrl: '',
        //企业标签
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        //工作图片
        cqimg: [],
        eatimg: [],
        stayimg: [],
        wageimg: [],
        //新增工作图片
        addcqimg: [],
        addeatimg: [],
        addstayimg: [],
        addwageimg: [],
        //录用条件
        WorkRuler: [],
        dialogFormVisible: false,
        ruleForm: {
          Title: '',
          Content: '',
        },
        //轮播图点击放大
        dialogImageUrl: '',
        dialogVisible: false,
        //全局表单验证
        listrules: {
          Name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          dynamicTags: [{
            required: true,
            validator: checktag
          }],
          Logo: [{
            required: true,
            validator: checkLogo
          }],
          cqimg: [{
            required: true,
            validator: checkcqimg
          }],
          eatimg: [{
            required: true,
            validator: checkeatimg
          }],
          stayimg: [{
            required: true,
            validator: checkstayimg
          }],
          wageimg: [{
            required: true,
            validator: checkwageimg
          }],
          Subsidy: [{
            required: true,
            message: "请输入补贴",
            trigger: "blur"
          }],
          Workstyle: [{
            required: true,
            message: "请输入工作方式",
            trigger: "blur"
          }],
          SubsidyType: [{
            required: true,
            message: '请选择补贴类型',
            trigger: 'change'
          }],
          SalaryDate: [{
            required: true,
            message: "请输入发薪日",
            trigger: "blur"
          }],
          WorkStore: [{
            required: true,
            message: "请输入门店联系方式",
            trigger: "blur"
          }],
          EnterprisePeople: [{
            required: true,
            message: "请输入企业规模",
            trigger: "blur"
          }],
          Salary: [{
            required: true,
            message: "请输入综合薪资",
            trigger: "blur"
          }],
          SSStay: [{
            required: true,
            message: "请输入住宿",
            trigger: "blur"
          }],
          Contract: [{
            required: true,
            message: "请输入合同说明",
            trigger: "blur"
          }],
          PayMoney: [{
            required: true,
            message: "请输入工资发放",
            trigger: "blur"
          }],
          SSEat: [{
            required: true,
            message: "请输入伙食",
            trigger: "blur"
          }],
          WorkEnvir: [{
            required: true,
            message: "请输入工作环境",
            trigger: "blur"
          }],
          Changework: [{
            required: true,
            message: "请输入两班倒",
            trigger: "blur"
          }],
          WorkContent: [{
            required: true,
            message: "请输入工作内容",
            trigger: "blur"
          }],
        },
        // 录用条件表单验证
        rules: {
          Title: [{
            required: true,
            message: '请输入条件',
            trigger: 'blur'
          }, ],
          Content: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }, ],
        },
        //补贴类型
        typeList: [{
            name: "补贴",
            type: 0
          },
          {
            name: "工价",
            type: 1
          },
          {
            name: "收费",
            type: 2
          }
        ],
        //类型过滤
        typeText(row, Type) {
          var type = row[Type.property];
          switch (type) {
            case 0:
              return (type = "补贴");
              break;
            case 1:
              return (type = "工价");
              break;
            case 2:
              return (type = "收费");
              break;
            default:
              break;
          }
        },
      };
    },
    computed: {
      userid: function () {
        return window.location.href.split("id=")[1]
      }
    },
    mounted() {
      this.mainurl = mainurl;
      this.action = this.mainurl + "/api/Back/UpdateForImage";
      this.getInfo()

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
          .get("api/Back/Enterprise", {
            params: {
              ID: window.location.href.split("id=")[1],
              Token: getCookie("token")
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.editForm = response.data.Result;
                for (let index = 0; index < response.data.Result.Tag.length; index++) {
                  this.dynamicTags.push(response.data.Result.Tag[index])
                }
                if (response.data.Result.IsBusy == '是') {
                  this.editForm.IsBusy = true
                }else{
                  this.editForm.IsBusy = false
                }
                this.WorkRuler = response.data.Result.WorkRuler;
                this.imageUrl = this.mainurl+response.data.Result.Logo;
                for (let i = 0; i < response.data.Result.WorkImages.length; i++) {
                  if (response.data.Result.WorkImages[i].Type == 0) {
                    // alert(1)
                    let arr = Array();
                    arr = {
                      url: this.mainurl + response.data.Result.WorkImages[i].Image
                    }
                    this.cqimg.push(arr)
                    this.addcqimg.push(response.data.Result.WorkImages[i].Image)
                  } else if (response.data.Result.WorkImages[i].Type == 1) {
                    let arr = Array();
                    arr = {
                      url: this.mainurl + response.data.Result.WorkImages[i].Image
                    }
                    this.eatimg.push(arr)
                    this.addeatimg.push(response.data.Result.WorkImages[i].Image)
                  } else if (response.data.Result.WorkImages[i].Type == 2) {
                    let arr = Array();
                    arr = {
                      url: this.mainurl + response.data.Result.WorkImages[i].Image
                    }
                    this.stayimg.push(arr)
                    this.addstayimg.push(response.data.Result.WorkImages[i].Image)
                  } else if (response.data.Result.WorkImages[i].Type == 3) {
                    let arr = Array();
                    arr = {
                      url: this.mainurl + response.data.Result.WorkImages[i].Image
                    }
                    this.wageimg.push(arr)
                    this.addwageimg.push(response.data.Result.WorkImages[i].Image)
                  }

                }
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
        this.$router.push("/company");
      },
      //批量上传图片
      cqhandleRemove(file, fileList) {
        //获取删除的图片地址，在addcqimg中对应删除
        console.log(file)
        let file1 = file.url
        for (let i = 0; i < this.addcqimg.length; i++) {
          if(this.mainurl+this.addcqimg[i] == file1){
            this.addcqimg.splice(i,1)
          }
        }
        if(file.response.Status == 1){
            let file2 = file.response.Result
            for (let i = 0; i < this.addcqimg.length; i++) {
            if(this.addcqimg[i] == file2){
              this.addcqimg.splice(i,1)
            }
          }
        }
      },
      eathandleRemove(file, fileList) {
        let file1 = file.url
        for (let i = 0; i < this.addeatimg.length; i++) {
          if(this.mainurl+this.addeatimg[i] == file1){
            this.addeatimg.splice(i,1)
          }
        }
        if(file.response.Status == 1){
            let file2 = file.response.Result
            for (let i = 0; i < this.addeatimg.length; i++) {
            if(this.addeatimg[i] == file2){
              this.addeatimg.splice(i,1)
            }
          }
        }
      },
      stayhandleRemove(file, fileList) {
        let file1 = file.url
        for (let i = 0; i < this.addstayimg.length; i++) {
          if(this.mainurl+this.addstayimg[i] == file1){
            this.addstayimg.splice(i,1)
          }
        }
        if(file.response.Status == 1){
            let file2 = file.response.Result
            for (let i = 0; i < this.addstayimg.length; i++) {
            if(this.addstayimg[i] == file2){
              this.addstayimg.splice(i,1)
            }
          }
        }
      },
      wagehandleRemove(file, fileList) {
        let file1 = file.url
        for (let i = 0; i < this.addwageimg.length; i++) {
          if(this.mainurl+this.addwageimg[i] == file1){
            this.addwageimg.splice(i,1)
          }
        }
        if(file.response.Status == 1){
            let file2 = file.response.Result
            for (let i = 0; i < this.addwageimg.length; i++) {
            if(this.addwageimg[i] == file2){
              this.addwageimg.splice(i,1)
            }
          }
        }
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      cqhandleAvatarSuccess(res, file) {
        this.addcqimg.push(res.Result[0])
      },
      eathandleAvatarSuccess(res, file) {
        this.addeatimg.push(res.Result[0])
      },
      stayhandleAvatarSuccess(res, file) {
        this.addstayimg.push(res.Result[0])
      },
      wagehandleAvatarSuccess(res, file) {
        this.addwageimg.push(res.Result[0])
      },
      //企业大图
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.editForm.Logo = res.Result[0];
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      //标签管理
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (this.dynamicTags.length >= 3) {
            this.$message({
              showClose: true,
              type: "warning",
              message: '最多添加3个标签哦'
            });
          } else {
            this.dynamicTags.push(inputValue);
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      // 添加录用条件
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.WorkRuler.push(this.ruleForm);
            this.dialogFormVisible = false;
            this.ruleForm = [];
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //移除录用条件
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      // 保存
      submitList(formName) {
        if (this.addcqimg.length > 4 || this.addeatimg.length > 4 || this.addstayimg.length > 4 || this.addwageimg.length > 4) {
          this.$message({
            showClose: true,
            type: "warning",
            message: '企业轮播图最多只能上传4张哦'
          });
          return;
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              var para = Object.assign({}, this.editForm);
              console.log(para)
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              //标签
              var tag = '';
              for (let i = 0; i < this.dynamicTags.length; i++) {
                tag += "" + this.dynamicTags[i] + ",";
              }
              tag = tag.substring(0, tag.length - 1)
              //厂区图
              var cq = '';
              for (let i = 0; i < this.addcqimg.length; i++) {
                cq += "" + this.addcqimg[i] + ",";
              }
              cq = cq.substring(0, cq.length - 1)
              //吃饭图
              var eat = '';
              for (let i = 0; i < this.addeatimg.length; i++) {
                eat += "" + this.addeatimg[i] + ",";
              }
              eat = eat.substring(0, eat.length - 1)
              //住宿图
              var stay = '';
              for (let i = 0; i < this.addstayimg.length; i++) {
                stay += "" + this.addstayimg[i] + ",";
              }
              stay = stay.substring(0, stay.length - 1)
              //工资条
              var wage = '';
              for (let i = 0; i < this.addwageimg.length; i++) {
                wage += "" + this.addwageimg[i] + ",";
              }
              wage = wage.substring(0, wage.length - 1)
              //录用条件
              var rule = '';
              if (this.WorkRuler.length == 0) {
                rule = '暂无,暂无'
              } else {
                for (let i = 0; i < this.WorkRuler.length; i++) {
                  rule += "" + this.WorkRuler[i].Title + "," + this.WorkRuler[i].Content + "|";
                }
                rule = rule.substring(0, rule.length - 1)
              }
              if (para.IsBusy == true) {
                para.IsBusy = 1
              }else{
                 para.IsBusy = 0
              }
              // 发保存请求
              this.$http
                .post("api/Back/EditEnterprise",
                  qs.stringify({
                    Token: getCookie("token"),
                    Name: para.Name,
                    WorkStore: para.WorkStore,
                    Logo: para.Logo,
                    Workstyle: para.Workstyle,
                    Salary: para.Salary,
                    BasicSalary: (para.BasicSalary == null) ? '0' : para.BasicSalary,
                    SalaryDate: para.SalaryDate,
                    SalaryExplain: (para.SalaryExplain == null) ? '暂无' : para.SalaryExplain,
                    SSEat: para.SSEat,
                    SSStay: para.SSStay,
                    Contract: para.Contract,
                    PayMoney: para.PayMoney,
                    Insurance: (para.Insurance == null) ? '暂无' : para.Insurance,
                    Prompt: (para.Prompt == null) ? '暂无' : para.Prompt,
                    Environment: para.Environment,
                    EnterpriseExplain: (para.EnterpriseExplain == null) ? '暂无' : para.EnterpriseExplain,
                    Adress: (para.Adress == null) ? '暂无' : para.Adress,
                    SubsidyDetail: para.SubsidyDetail,
                    Subsidy: para.Subsidy,
                    SubsidyType: para.SubsidyType,
                    EnterprisePeople: para.EnterprisePeople,
                    WorkEnvir: para.WorkEnvir,
                    WorkContent: para.WorkContent,
                    ID: window.location.href.split("id=")[1],
                    Tag: tag,
                    FactoryImage: cq,
                    EatImage: eat,
                    LiveImage: stay,
                    PayrollImage: wage,
                    Ruler: rule,
                    SubsidyType: para.SubsidyType,
                    Changework:para.Changework,
                    IsBusy:para.IsBusy,
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
                      // 表单重置
                      this.$refs["getList"].resetFields();
                      this.getInfo();
                      this.back()
                      this.change = false;
                      this.add = fasle;
                    } else if (status === 40001) {
                      this.$message({
                        showClose: true,
                        type: "warning",
                        message: response.data.Result
                      });
                      setTimeout(() => {
                        tt.$router.push({
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
                    // loading.close();
                    //   this.$notify.error({
                    //     title: "错误",
                    //     message: "错误：请检查网络"
                    // });
                  }.bind(this)
                );
            });
          }
        });
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
