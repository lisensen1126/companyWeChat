import http from "../http";

let apis = {
  // 获取个人信息
  getLogin(data) {
    return http("work/v1/auth/login", {
      method: "POST",
      params: data
    });
  },
  getConfig(data) {
    return http("work/v1/common/config", {
      method: "POST",
      params: data
    });
  },
  getAgentConfig(data) {
    return http("work/v1/common/agent_config", {
      method: "POST",
      params: data
    });
  }
};
export default apis;
