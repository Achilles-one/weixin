<template>
  <div class="container">
    <transition 
    @after-leave="afterLeave"
    leave-active-class="login-active">
      <div v-if="showLogin" class="login">
        <div class="login-top">登录</div>
        <div class="login-center clearfix">
          <div class="login-center-img"><img src="images/name.png" /></div>
          <div class="login-center-input">
            <input
              type="text"
              v-model="wxid"
              placeholder="请输入您的用户名"
              onfocus="this.placeholder=''"
              onblur="this.placeholder='请输入您的用户名'"
            />
            <div class="login-center-input-text">用户名</div>
          </div>
        </div>
        <div class="login-center clearfix">
          <div class="login-center-img"><img src="images/password.png" /></div>
          <div class="login-center-input">
            <input
              type="password"
              v-model="password"
              placeholder="请输入您的密码"
              onfocus="this.placeholder=''"
              onblur="this.placeholder='请输入您的密码'"
            />
            <div class="login-center-input-text">密码</div>
          </div>
        </div>

        <div class="login-button" @click="handleLogin">登录</div>
      </div>
    </transition>


<!-- duration设置rotate动画持续的时间 -->
    <transition 
    :duration="2000"
    enter-active-class="sk-rotating-plane-active">
      <div v-if="showRotate" class="sk-rotating-plane"></div>
    </transition>
  </div>
</template>

<script>
import "../assets/css/login.less";


export default {
  data() {
    return {
      showLogin: true,
      showRotate: false,
      wxid: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      this.showLogin = false

      try {
        const {data} = await this.http.post('/login', {
        wxid: this.wxid,
        password: this.password
      })

      if(data.success) {
        // 把当前登录的用户本地存储起来
        localStorage.setItem('user', JSON.stringify(data.user))
        // 将当前用户存储到state中
        this.state.user = data.user

        // 跳转到聊天页面
        this.$router.push('/chat')
      }else {
        alert('登录失败')
        this.showLogin = true
        this.showRotate = false
      }
      } catch(e) {
        alert('服务器出问题了')
      }

      
    },
    // 当login动画结束之后，让rotate动画显示
    afterLeave() {
      this.showRotate = true
    }
  }
};
</script>

<style>
</style>