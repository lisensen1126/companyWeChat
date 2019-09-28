import http from "../http";

let apis = {
  getInfo(data) {
    return http("work/v1/report/monthly", {
      method: "GET",
      params: data
    });
  }
};

export default apis;
