import MessageNotice from "@/views/message/MessageNotice.vue";
import MessageDetail from "@/views/message/MessageDetail.vue";
export default [
  {
    path: "/message-notice",
    name: "message-notice",
    component: MessageNotice,
    meta: {
      title: "消息通知"
    }
  },
  {
    path: "/message-detail",
    name: "message-detail",
    component: MessageDetail,
    meta: {
      title: "消息详情"
    }
  }
];
