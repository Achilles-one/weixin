<template>
  <div class="user-list">
    <!-- 搜索框 -->
    <Search v-model="searchValue" />

    <!-- 聊天用户列表 -->
    <div class="msg-list">
      <ul>
        <li
          v-for="(item, index) in searchList"
          :key="item.user.id"
          :class="{ active: selectedIndex === index }"
          @click="selectedIndex = index"
          class="session-list"
        >
          <div class="list-left">
            <img
              width="42"
              height="42"
              :alt="item.user.nickname"
              :src="'/images/face/' + item.user.icon"
              class="avatar"
            />
          </div>
          <div class="list-right">
            <p class="name">{{ item.user.nickname }}</p>
            <span class="time">{{ lastTime(item.messages) }}</span>
            <p class="last-msg">{{ lastContent(item.messages) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="chat-list">
    <!-- 聊天内容区域 -->
    <div class="message">
      <!-- 聊天框头部 -->
      <header class="header">
        <div class="friendname">{{ currentUser?.user?.nickname }}</div>
      </header>
      <div class="message-wrapper" ref="wrapper">
        <ul>
          <li
            v-for="(msg, index) in currentUser?.messages"
            :key="index"
            class="message-item"
          >
            <div class="time">
              <span>{{ formatTime(msg.time) }}</span>
            </div>
            <div class="message-main" :class="{ self: msg.self }">
              <img
                width="36"
                height="36"
                :src="
                  msg.self
                    ? '/images/face/' + state.user.icon
                    : '/images/face/' + currentUser?.user?.icon
                "
                class="avatar"
              />
              <div class="content">
                <div class="text">{{ msg.content }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 消息发送区 -->
    <div class="send-text">
      <!-- emoji -->
      <Emoji v-model="showEmoji" @update="handleUpdate" />

      <!-- 发送消息框 -->
      <textarea
        @keypress.enter.prevent="handleMsg"
        v-model="content"
        @click="showEmoji = false"
      ></textarea>
      <div class="send" @click="handleMsg">
        <span>发送(Enter)</span>
      </div>
      <div class="warn" v-show="showWarn">
        <div class="description">不能发送空白信息</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/chat.less";
import Search from "../components/Search.vue";
import Emoji from "../components/Emoji.vue";
import dayjs from "dayjs";
// 图灵机器人聊天
// import axios from 'axios'
import { io } from "socket.io-client";

export default {
  components: { Search, Emoji },
  data() {
    return {
      selectedIndex: 0,
      searchValue: "",
      showEmoji: false,
      showWarn: false,
      // 绑定发送消息文本框
      content: "",
      socket: null,
    };
  },
  created() {
    this.socket = io("http://127.0.0.1:5000", {
      path: "/mychat",
      transports: ["websocket"],
      query: {
        user: JSON.stringify(this.state.user),
      },
    });

    this.socket.on("connect", () => {
      console.log("连接成功");

      this.socket.on("disconnect", () => {
        console.log("断开连接");
      });
      // 接收服务器返回的消息
      this.socket.on("message", ({ from, to, content, type }) => {
        // 在 recents 中找 from 好友
        let recent = this.state.recents.find((r) => r.user.id === from);
        if (!recent) {
          // 如果最近聊天列表中不存在，再去好友列表中查找(把friends定义到全局的state中)
          let user = null;
          for (let i = 0; i < this.state.friends.length; i++) {
            const f = this.state.friends[i];
            user = f.users.find((u) => u.id === from);

            if (user) break;
          }
          console.log(from, to);
          // 构建最新好友列表中的项目
          recent = {
            user: {
              id: user.id,
              nickname: user.nickname,
              icon: user.icon,
              robot: user.robot,
            },
            messages: [],
          };

          // 把recent添加到recents中
          this.state.recents.unshift(recent);
        }

        recent.messages.push({
          self: false,
          content: content,
          time: Date.now(),
        });

        window.localStorage.setItem(
          "recents" + this.state.user.id,
          JSON.stringify(this.state.recents)
        );

        this.$nextTick(() => {
          this.$refs.wrapper.scrollTop = this.$refs.wrapper.scrollHeight;
        });
      });
    });
  },
  computed: {
    // 便于在组件中简写recents
    recents() {
      return this.state.recents;
    },
    // 当前选中的好友
    currentUser() {
      return this.recents[this.selectedIndex];
    },
    searchList() {
      return this.recents.filter((r) =>
        r.user.nickname.startsWith(this.searchValue)
      );
    },
  },
  methods: {
    handleUpdate(code) {
      this.content += code;
    },
    lastTime(messages) {
      return this.formatTime(messages[messages.length - 1]?.time);
    },
    lastContent(messages) {
      return messages[messages.length - 1]?.content;
    },
    formatTime(time) {
      return time ? dayjs(time).format("HH:mm") : "";
    },
    async handleMsg() {
      // 判断是否有选中好友
      if (!this.currentUser) {
        return alert("请选择要聊天的好友");
      }
      // 判断是否有输入内容
      if (this.content.trim().length <= 0) {
        this.showWarn = true;

        setTimeout(() => {
          this.showWarn = false;
        }, 2000);
      }

      this.currentUser.messages.push({
        time: Date.now(),
        content: this.content,
        self: true,
      });

      console.log(this.currentUser.user.icon);


      // 判断当前好友是否是机器人,和图灵机器人聊天
      // if(this.currentUser.user.robot) {
      //   const url = '/api/v2'
      //   const postData = {
      //     "reqType":0,
      //       "perception": {
      //           "inputText": {
      //               "text": this.content
      //           },
      //           "selfInfo": {
      //               "location": {
      //                   "city": "河北省",
      //                   "province": "邯郸市",
      //                   "street": "中华路"
      //               }
      //           }
      //       },
      //       "userInfo": {
      //           "apiKey": "25d308027eb147d6b440b78db3d8ab23",
      //           "userId": 123
      //       }
      //   }
      //   const { data } = await axios.post(url, postData)
      //   this.currentUser.messages.push({
      //   time: Date.now(),
      //   content: data.results[0]?.values.text,
      //   self: false
      // })
      // }

      // 存储最近聊天好友列表
      window.localStorage.setItem(
        "recents" + this.state.user.id,
        JSON.stringify(this.state.recents)
      );

      this.socket.emit("message", {
        from: this.state.user?.id,
        to: this.currentUser.user?.id,
        content: this.content,
        type: "user",
      });


      this.content = "";
      // 让滚动条滚动到最后
      this.$nextTick(() => {
        // 滚动条滚动的距离=滚动条的高度
        this.$refs.wrapper.scrollTop = this.$refs.wrapper.scrollHeight;
      });
    },
  },
};
</script>

<style>
</style>