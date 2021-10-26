<template>
  <!-- 好友列表 -->
  <div class="friend-wrapper">
    <!-- 搜索框 -->
    <Search v-model="searchValue" />

    <!-- 好友列表 -->
    <div class="friend-list">
      <ul>
        <!-- <li class="friend-item">
          <div class="list-title">新的朋友</div>
          <div class="friend-info">
            <img
              width="36"
              height="36"
              src="/images/newfriend.jpg"
              class="avatar"
            />
            <div class="remark">新的朋友</div>
          </div>
        </li> -->

        <!-- <li v-for="(friend, index) in friends" :key="index" class="friend-item"> -->
        <li v-for="(friend, index) in friends" :key="index" class="friend-item">
          <div class="list-title">{{ friend.letter }}</div>
          <!-- 好友 -->
          <div
            v-for="user in friend.users"
            :key="user.id"
            :class="{ active: selectedUserId === user.id }"
            @click="selectedUserId = user.id"
            class="friend-info"
          >
            <img
              width="36"
              height="36"
              :src="'/images/face/' + user.icon"
              class="avatar"
            />
            <div class="remark">{{ user.nickname }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="friend-info">
    <!-- 好友详情 -->
    <div class="info-wrapper">
      <div class="friend-info">
        <div class="es-info">
          <div class="left">
            <div class="people">
              <div class="nickname">{{ currentUser?.nickname }}</div>
              <div :class="currentUser?.sex === 'male' ? 'gender-male' : 'gender-female'"></div>
              <!-- <div :class="chooseSex"></div> -->
            </div>
            <div class="signature">{{ currentUser?.summary }}</div>
          </div>
          <div class="right">
            <img
              class="avatar"
              width="60"
              height="60"
              :src="'/images/face/' + currentUser?.icon"
            />
          </div>
        </div>
        <div class="detInfo">
          <div class="remark">
            <span>备&nbsp;&nbsp;&nbsp;注</span>{{ currentUser?.remark }}
          </div>
          <div class="area">
            <span>地&nbsp;&nbsp;&nbsp;区</span>{{ currentUser?.area }}
          </div>
          <div class="wxid"><span>微信号</span>{{ currentUser?.wxid }}</div>
        </div>
        <div class="send" @click="handleSend">
          <span>发消息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/friend.less";
import Search from "../components/Search.vue";

export default {
  components: { Search },
  // 组件被创建的时候
  async created() {

    // 调用loadFriends获取好友列表,放到Header.vue中了
    // await this.loadFriends()

    // ?如果有数据则返回数据，没有则返回end，后面不再执行。ES语法
    // 以防新用户没有朋友
    this.selectedUserId = this.friends[0]?.users[0]?.id;  
  },
  computed: {
    friends() {
      return this.state.friends
    },
    // 当前选择的好友
    currentUser() {
      let user = null;

      for (let i = 0; i < this.friends.length; i++) {
        const friend = this.friends[i];

        user = friend.users.find((u) => u.id === this.selectedUserId);
        if (user) {
          break;
        }
      }

      return user;
    },
    // chooseSex() {
    //   let sex = "";
    //   if (this.currentUser?.sex === "male") {
    //     sex = "gender-male";
    //   } else if (this.currentUser?.sex === "female") {
    //     sex = "gender-female";
    //   } else {
    //     sex = "gender-robot";
    //   }
    //   return sex;
    // },

    // 搜索
    // searchFriends() {
    //   console.log(this.searchValue)
    //   return this.friends.filter(f => f.users.nickname.startsWith(this.searchValue))
    // }
  },
  data() {
    return {
      selectedUserId: 0,
      searchValue: ""
    };
  },
  methods: {
  // 放到Header.vue中了
  //  async loadFriends() {
  //    const { data } = await this.http.get('/friends', {
  //      headers: {
  //        token: this.state.user?.token
  //      }
  //    })
  //    this.friends = data
  //  },
    handleSend() {
      // 创建 最近聊天的好友的数据
      const recent = {
        user: {
          id: this.currentUser?.id,
          nickname: this.currentUser?.nickname,
          icon: this.currentUser?.icon,
          robot: this.currentUser?.robot
        },
        messages: []
      }

      // 判断recents数组中是否已经有当前好友
      const index  = this.state.recents.findIndex(r => r.user.id === recent.user.id)
      // 如果没有，直接把recent添加到数组中的第一项的位置
      if(index <= -1) {
        this.state.recents.unshift(recent)
      }else {
        // 如果有，要把当前对应的用户调整到第一项的位置
        // tmp等于剪切掉的数组
        const tmp = this.state.recents.splice(index, 1)
        this.state.recents.unshift(tmp[0])
      }

      // 存储最近聊天好友列表
      window.localStorage.setItem('recents' + this.state.user.id, JSON.stringify(this.state.recents))

      console.log(this.state.recents);
      this.$router.push('/chat')
    }
  }
};
</script>

<style>
</style>