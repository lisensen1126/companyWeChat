import http from "../http";

let apis = {
  // 获取文章列表
  getBrandArticleListApi(data) {
    return http("work/v1/brand_content/list", {
      method: "GET",
      params: data
    });
  },
  // 获取文章详情
  getBrandArticleDetailApi(data) {
    return http("work/v1/brand_content/detail", {
      method: "GET",
      params: data
    });
  },
};

export default apis;
