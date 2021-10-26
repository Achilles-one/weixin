import { createApp, reactive } from 'vue'
import App from './App.vue'

import router from './router/index'

import './assets/css/normalize.css'
import './assets/css/base.less'

// 导入字体图片样式
import './assets/fonts/iconfont.css'

// 导入封装好的axios插件
import http from './plugins/index'

const app = createApp(App)
app.use(router).use(http).mount('#index')


// 创建一个共享的数据,在所有组件中都可以共享
// reactive创建响应式的数据
app.config.globalProperties.state = reactive({
    // 当前登录的用户
    user: JSON.parse(localStorage.getItem('user')),
    // 最近的好友联系列表
    // [{{ user: { id, nickname, icon, robot }, messages: [{ time, content, self }] }}]
    recents: [],
    friends: []
})