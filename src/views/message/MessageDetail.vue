<template>
  <div class="message-detail-cly">
    <h3 class="title font-16">
      {{detail.title}}
    </h3>
    <div class="time">
      <span class="font-10">发布人：壳保养智慧门店</span>
      <span class="font-10" v-text="detail.send_at"></span>
    </div>
    <div class="content font-12" v-html="content"></div>
  </div>
</template>
<script>
import Api from "@/api/messageApi";
import ApiCard from "@/api/cardApi";
import AppConfig from "../../app.config.js";
import { ChangeDateTime } from "../article/DateTimes.js";

export default {
  name: "MessageDetail",
  data() {
    return {
      detail: {},
      content: ""
    };
  },
  methods: {
    getDetail() {
      let self = this;
      self.$loading.show("加载中");
      Api.getMessageDetail({
        id: self.$route.query.id
      }).then(
        function(res) {
          if (res.code === 0) {
            self.$loading.hide();
            res.data.send_at = ChangeDateTime(res.data.send_at);
            self.detail = res.data;
            self.content = res.data.info.content;
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>
<style lang="less">
.message-detail-cly {
  padding: 0.4rem;
  background-color: #fff;
  min-height: 100vh;
  .title {
    color: #3d424c;
    font-weight: bold;
  }
  .time {
    margin-top: 0.2rem;
    color: #8a92a2;
    span:last-child {
      margin-left: 0.3rem;
    }
  }
  .content {
    color: #3d424c;
    line-height: 0.4rem;
    margin-top: 0.1rem;
    img {
      width: 6.9rem !important;
      height: auto;
      margin: 0.3rem 0;
    }
  }
}
</style>
