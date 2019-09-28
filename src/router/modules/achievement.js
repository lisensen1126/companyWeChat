import Achieve from "@/views/achievement/Index.vue";
import PeopleNum from "@/views/achievement/PeopleNum.vue";
import AchieveNum from "@/views/achievement/AchieveNum.vue";
import OfflinePerformance from "@/views/achievement/OfflinePerformance.vue";

export default [
  {
    path: "/achieve-index",
    name: "achieveIndex",
    component: Achieve,
    meta: {
      title: "业绩看板",
      keepAlive: true,
    }
  },
  {
    path: "/people-num",
    name: "peopleNum",
    component: PeopleNum,
    meta: {
      title: "线上用户"
    }
  },
  {
    path: "/achieve-Num",
    name: "achieveNum",
    component: AchieveNum,
    meta: {
      title: "线上用户"
    }
  },
  {
    path: "/offlinePerformance",
    name: "offlinePerformance",
    component: OfflinePerformance,
    meta: {
      title: "线下业绩"
    }
  }
];
