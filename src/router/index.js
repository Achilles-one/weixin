import { createRouter, createWebHashHistory } from "vue-router";

import Login from '../views/Login.vue'
import Chat from '../views/Chat.vue'
import Friends from '../views/Friends.vue'
import Collection from '../views/Collection.vue'
import Header from '../header/Header.vue'

const router = createRouter({
    linkActiveClass: 'active',
    history: createWebHashHistory(),
    routes: [
        // 配置的路由地址和组件的对应关系
        {
            path: '/login',
            component: Login
            // component: () => import('../views/Login.vue')
        },
        {
            path: '/',
            component: Header,
            redirect: '/chat',
            children: [
                {
                    path: '/chat',
                    component: Chat
                },
                {
                    path: '/friends',
                    component: Friends
                },
                {
                    path: '/collection',
                    component: Collection
                }
            ]
        }
    ]
})

// 路由前置守卫（拦截器）
router.beforeEach((to, from, next) => {
    if (to.path.toLowerCase() === '/login') {
      next()
    } else {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.token) {
        next()
      } else {
        alert('请先登陆')
        next('/login')
      }
    }
  })

export default router