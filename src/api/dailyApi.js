import http from "../http";

let apis = {
  getDailyInfoApi(data) {
    return http("work/v1/report/daily", {
      method: "GET",
      params: data
    });
  },
  getMonthlyInfoApi(data) {
    return http("work/v1/report/monthly", {
      method: "GET",
      params: data
    });
  },
  getCityDataApi(data) {
    return http("work/v1/analysis/colleague_data_analysis", {
      method: "GET",
      params: data
    });
  },
  getApplyApi() {
    return http("work/v1/apply/check_apply", {
      method: "GET"
    });
  }
};

export default apis;
