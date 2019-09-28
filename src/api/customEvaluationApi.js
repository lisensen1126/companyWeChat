import http from "../http";

let apis = {
  getEvalutionInfo(data) {
    return http("work/v1/customer_evaluation", {
      method: "GET",
      params: data
    });
  },
  getRankListInfo() {
    return http("work/v1/technician/rank", {
      method: "GET",
      params: {
        page: 1,
        per_page: 5000,
        is_all: 1
      }
    });
  },
  // 删除商家回复
  deleteCommentApi(query) {
    return http("work/v1/comment/delete", {
      method: "POST",
      params: query
    });
  },
  // 编辑商家回复
  editCommentApi(query) {
    return http("work/v1/comment/update", {
      method: "POST",
      params: query
    });
  },
  // 创建商家回复
  createCommentApi(query) {
    return http("work/v1/comment/create", {
      method: "POST",
      params: query
    });
  },
};
export default apis;
