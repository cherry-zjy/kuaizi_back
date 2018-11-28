import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// 路由页面导入
import login from '@/components/Login.vue'
import home from '@/components/Home.vue'
import error from '@/components/404.vue'  //404错误
// import manage from '@/components/manage/manage.vue'
//平台管理
var banner = resolve => require(['../components/basic/banner.vue'], resolve)  
var feedback = resolve => require(['../components/basic/feedback.vue'], resolve)  
var comment = resolve => require(['../components/basic/comment.vue'], resolve)
var AddBanner = resolve => require(['../components/basic/AddBanner.vue'], resolve)
var EditBanner = resolve => require(['../components/basic/EditBanner.vue'], resolve) 
var News = resolve => require(['../components/basic/News.vue'], resolve)  
var AddNews = resolve => require(['../components/basic/AddNews.vue'], resolve)
var EditNews = resolve => require(['../components/basic/EditNews.vue'], resolve)

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
        //平台管理
        { path: '/banner', component: banner, name: 'banner列表' },                
        { path: '/feedback', component: feedback, name: '意见反馈列表' },                
        { path: '/comment', component: comment, name: '评论列表' },
        { path: '/AddBanner', component: AddBanner, name: '添加Banner' }, 
        { path: '/EditBanner/:id', component: EditBanner, name: '修改Banner' },
        { path: '/News', component: News, name: '新闻列表' },
        { path: '/AddNews', component: AddNews, name: '添加新闻' }, 
        { path: '/EditNews/:id', component: EditNews, name: '修改新闻r' },                                 
      ]
    },
  ]
})
