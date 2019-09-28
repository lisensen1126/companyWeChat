import Rank from "@/views/rank/Rank.vue";
import Store from "@/views/rank/Store.vue";

export default [
  {
    path: "/rank",
    name: "rank",
    component: Rank,
    meta: {
      title: "技师排名"
    }
  },
  {
    path: "/store",
    name: "store",
    component: Store,
    meta: {
      title: "门店列表"
    }
  }
];
