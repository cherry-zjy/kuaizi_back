<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始日期" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="入职状态">
          <el-select v-model="filters.Type" placeholder="入职状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="用户名" prop="Name">
      </el-table-column>
      <el-table-column label="联系电话" prop="Phone" width="150">
      </el-table-column>
      <el-table-column label="报名时间" prop="Time" :formatter="timefilterHandler" width="150">
      </el-table-column>
      <el-table-column label="经纪人号码" prop="AgentPhone" width="150">
      </el-table-column>
      <el-table-column label="申请企业" prop="Enterprise">
      </el-table-column>
      <el-table-column label="入职状态" prop="Type" width="150">
      </el-table-column>
      <el-table-column label="入职时间" prop="WorkTime" width="150" :formatter="WorkTime">
      </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.Type == '未入职'" size="mini" type="primary" @click="entry(scope.row.ID)">入职</el-button>
          <el-button v-if="scope.row.Type == '已入职'" size="mini" type="warning" @click="send(scope.row.ID)">发放津贴</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDel(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <!-- 模态框 -->
    <el-dialog title="发放津贴" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="money" :rules="rules" ref="money" label-width="100px" class="demo-ruleForm">
        <el-form-item label="金额" prop="Money">
          <el-input v-model="money.Money"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('money')">确 定</el-button>
      </div>
    </el-dialog>

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
          StartTime: "",
          EndTime: "",
          Type:-1
        },
        money:[],
        dialogFormVisible:false,
        rules: {
            Money: [{
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }, ],
        },
        typeList:[{
            name: "全部",
            value: -1
          },
          {
            name: "申请中",
            value: 1
          },
          {
            name: "已入职",
            value: 2
          },
        ],
        mainurl:''
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
          .get("api/Back/QuerySign", {
            params: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              Query:(this.filters.keyword == '') ? '-1' : this.filters.keyword,
              Token: getCookie("token"),
              StartTime:(this.filters.StartTime == '') ? '-1' : this.filters.StartTime,
              EndTime:(this.filters.EndTime == '') ? '-1' : this.filters.EndTime,
              Type:this.filters.Type,
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if(status === 1){
                this.List = response.data.Result.List;
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

      timefilterHandler(row) {
        var Time = row.Time;
        Time = Time.substring(0, 10);
        return Time
      },
      WorkTime(row) {
        var WorkTime = row.WorkTime;
        if (WorkTime !== null) {
          WorkTime = WorkTime.substring(0, 10);
        }
        return WorkTime
      },
      
      //重置按钮
      getAllUsers() {
        this.filters = {
          keyword: "",
          StartTime: "",
          EndTime: "",
          Type: -1
        }
      },
      send(id){
        this.money.ID = id;
        this.dialogFormVisible = true;
      },
      //删除
      handleDel(id){
        this.$confirm('确认删除该报名?', '提示', {
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
            .get("api/Back/DelSign", {
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
            message: '已取消'
          });
        });
      },
      
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
      entry(id) {
        this.$confirm('确认入职?', '提示', {
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
            .get("api/Back/Entry", {
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
      //发放津贴
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
            this.$http
            .get("api/Back/SendMoney", {
              params: {
                Token: getCookie("token"),
                ID: this.money.ID,
                Money: this.money.Money,
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
                  this.dialogFormVisible = false;
                  this.getInfo();
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
            this.dialogFormVisible = false;
            this.editlist = [];
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
