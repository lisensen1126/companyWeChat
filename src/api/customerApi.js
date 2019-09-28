import http from "../http";

let apis = {
  getCustomerList(data) {
    return http("work/v1/customer", {
      method: "GET",
      params: data
    });
  },
  getCustomerDetail(data) {
    return http("work/v1/customer/detail", {
      method: "GET",
      params: data
    });
  },
  chooseContacts(data) {
    return http("work/v1/customer/add", {
      method: "POST",
      params: data
    });
  },
  getShareInfo(data) {
    return http("work/v1/qr_code/card", {
      method: "GET",
      params: data
    });
  },
  //标记标星客户
  starCustomerAdd(data) {
    return http("work/v1/customer/sign", {
      method: "POST",
      params: data
    });
  },
  //取消标记标星客户
  starCustomerCancel(data) {
    return http("work/v1/customer/un_sign", {
      method: "POST",
      params: data
    });
  },
  //保存资料
  saveInfomation(data) {
    return http("work/v1/customer/save", {
      method: "POST",
      params: data
    });
  },
  //获取客户编辑
  getEditInfo: function(data) {
    return http("work/v1/customer/show", {
      method: "GET",
      params: data
    });
  },
  // 获取签名
  commonAgentConfig(data) {
    return http("/work/v1/common/agentConfig", {
      method: "POST",
      params: data
    });
  },
  relayQRCode(params) {
    return http("work/v1/qr_code/relay", {
      method: "POST",
      params: params
    });
  },
  // 卡记录
  getUpkeepListApi(params) {
    return http("work/v1/upkeep/list", {
      method: "POST",
      params: params
    });
  },
  // 卡详情
  getCardDetail(params) {
    return http("work/v1/upkeep/detail", {
      method: "POST",
      params: params
    });
  },
  // 核销卡详情
  getWriteCardOffApi(params) {
    return http("work/v1/upkeep/validate_info_new", {
      method: "GET",
      params: params
    });
  },
  // 获取用户可用养护卡
  getCusCardListApi(data) {
    return http("work/v1/upkeep/customer_upkeep", {
      method: "GET",
      params: data
    });
  }
};
export default apis;
