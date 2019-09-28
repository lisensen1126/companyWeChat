import Card from "@/views/card/Card.vue";
import CardNew from "@/views/card/CardNew.vue";

export default [
  {
    path: "/card",
    name: "card",
    component: Card,
    meta: {
      title: "我的名片"
    }
  },
  {
    path: "/mycard",
    name: "mycard",
    component: CardNew,
    meta: {
      title: "我的名片"
    }
  }
];
