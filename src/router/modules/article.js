import ArticleList from "@/views/article/ArticleList.vue";
import ArticleDetail from "@/views/article/ArticleDetail.vue";
export default [
  {
    path: "/article",
    name: "article",
    component: ArticleList,
    meta: {
      title: "好文推荐"
    }
  },
  {
    path: "/article-detail",
    name: "article-detail",
    component: ArticleDetail,
    meta: {
      title: "好文推荐"
    }
  }
];
