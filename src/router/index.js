import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// 路由页面导入
import login from '@/components/Login.vue'
import home from '@/components/Home.vue'
import error from '@/components/404.vue'  //404错误
// import manage from '@/components/manage/manage.vue'
var manage = resolve => require(['@/components/manage/manage.vue'], resolve)

var role = resolve => require(['@/components/role/role.vue'], resolve)
var roleLimit = resolve => require(['@/components/role/roleLimit.vue'], resolve)
var power = resolve => require(['../components/role/power.vue'], resolve)

// 打工管理
var company = resolve => require(['../components/work/company.vue'], resolve)  
var editcompany = resolve => require(['../components/work/editcompany.vue'], resolve)  
var addcompany = resolve => require(['../components/work/addcompany.vue'], resolve)  
var store = resolve => require(['../components/work/store.vue'], resolve)  
var addstore = resolve => require(['../components/work/addstore.vue'], resolve)  
var editstore = resolve => require(['../components/work/editstore.vue'], resolve)  
var enter = resolve => require(['../components/work/enter.vue'], resolve)  
//用户管理
var user = resolve => require(['../components/user/user.vue'], resolve)  
var userdetail = resolve => require(['../components/user/userdetail.vue'], resolve)  
var experience = resolve => require(['../components/user/experience.vue'], resolve)  
var wage = resolve => require(['../components/user/wage.vue'], resolve)  
var agent = resolve => require(['../components/user/agent.vue'], resolve)  
var wagelist = resolve => require(['../components/user/wagelist.vue'], resolve)  
//提现管理
var withdraw = resolve => require(['../components/withdraw/withdraw.vue'], resolve)  
//平台管理
var banner = resolve => require(['../components/basic/banner.vue'], resolve)  
var feedback = resolve => require(['../components/basic/feedback.vue'], resolve)  
var comment = resolve => require(['../components/basic/comment.vue'], resolve)  

// 懒加载方式，当路由被访问的时候才加载对应组件
Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '首页',
      component: home,
      children: [
        // 404
        { path: '/error', component: error, name: '404页' },
        // manage
        { path: '/manage', component: manage, name: '管理员管理', },
        // role
        { path: '/role', component: role, name: '权限管理' },
        { path: '/power', component: power, name: '角色管理' },
        { path: '/role/rolelimit/:id', component: roleLimit, name: '权限设置' },

        // 打工管理
        { path: '/company', component: company, name: '企业列表' },
        { path: '/work/editcompany/:id', component: editcompany, name: '编辑企业列表' },
        { path: '/work/addcompany', component: addcompany, name: '添加企业列表' },
        { path: '/store', component: store, name: '门店列表' },
        { path: '/work/addstore', component: addstore, name: '添加门店列表' },
        { path: '/work/editstore/:id', component: editstore, name: '编辑门店列表' },
        { path: '/enter', component: enter, name: '报名列表' },
        // 用户管理
        { path: '/user', component: user, name: '普通用户列表' },
        { path: '/user/userdetail/:id', component: userdetail, name: '用户详情' },
        { path: '/user/experience/:id', component: experience, name: '工作经历' },
        { path: '/user/wage/:id', component: wage, name: '工资详情' },
        { path: '/agent', component: agent, name: '经理人列表' },
        { path: '/wagelist', component: wagelist, name: '工资列表' },
        //提现管理
        { path: '/withdraw', component: withdraw, name: '提现列表' },        
        //平台管理
        { path: '/banner', component: banner, name: 'banner列表' },                
        { path: '/feedback', component: feedback, name: '意见反馈列表' },                
        { path: '/comment', component: comment, name: '评论列表' },                
      ]
    },
  ]
})
