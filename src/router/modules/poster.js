import PosterList from "@/views/poster/PosterList.vue";
import EventList from "@/views/poster/EventList.vue";
import PosterDetail from "@/views/poster/PosterDetail.vue";
export default [
  {
    path: "/poster-list",
    name: "poster-list",
    component: PosterList,
    meta: {
      title: "海报模板"
    }
  },
  {
    path: "/event-list",
    name: "event-list",
    component: EventList,
    meta: {
      title: "选择活动"
    }
  },
  {
    path: "/poster-detail",
    name: "poster-detail",
    component: PosterDetail,
    meta: {
      title: "生成海报"
    }
  },
];