import http from "../http";

let apis = {
  getArticleList(data) {
    return http("work/v1/notice", {
      method: "GET",
      params: data
    });
  },
  getMessageList(data) {
    return http("work/v1/notice/notice_count", {
      method: "GET",
      params: data
    });
  },
  getMessageDetail(data) {
    return http("work/v1/notice/detail", {
      method: "POST",
      params: data
    });
  }
};
export default apis;
