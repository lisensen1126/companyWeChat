import http from "../http";
let apis = {
  getRankListInfo(params) {
    return http("work/v1/technician/rank", {
      method: "GET",
      params: params
    });
  }
};
export default apis;
