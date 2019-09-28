import http from "../http";

let apis = {
  // 获取海报列表
  getPosterList(data) {
    return http("work/v1/poster/list", {
      method: "GET",
      params: data
    });
  },
  // 获取宣传海报列表
  getMaterialPosterListApi(data) {
    return http("work/v1/poster/material_list", {
      method: "GET",
      params: data
    });
  },
  // 获取海报背景二维码等详情
  getPosterDetail(data) {
    return http("work/v1/poster/qrcode", {
      method: "GET",
      params: data
    });
  },
  // 获取文章列表
  getArticleList(data) {
    return http("work/v1/content", {
      method: "GET",
      params: data
    });
  },
  // 获取文章详情
  getArticleDetail(data) {
    return http("work/v1/content/detail", {
      method: "GET",
      params: data
    });
  },
  relayQRCode(params) {
    return http("work/v1/content/relay", {
      method: "POST",
      params: params
    });
  }
};

export default apis;
