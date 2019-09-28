import http from "../http";

let apis = {
  // 首页信息
  indexData(data) {
    return http("customer/index", {
      method: "GET",
      params: data
    });
  },
  // 企业名录列表
  customerList(data) {
    return http("customer/list", {
      method: "GET",
      params: data
    });
  },
  // 添加客户
  customerAdd(data) {
    return http("customer/add", {
      method: "POST",
      params: data
    });
  },
  // 流失风险客户
  customerLoss(data) {
    return http("customer/loss/" + data.type, {
      method: "GET",
      params: data
    });
  },

  // 客户详情
  customerDetail(data) {
    return http(`customer/detail/${data}`, {
      method: "GET"
    });
  },
  // 消费记录
  customerRecords(data) {
    return http(`customer/consume_records/${data.customer_third_id}`, {
      method: "GET",
      params: data
    });
  },
  // 会员卡信息
  customerCardInfo(data) {
    return http(`customer/card_info/${data}`, {
      method: "GET"
    });
  },
  // 关联客户
  customerCorrelation(data) {
    return http("customer/correlation", {
      method: "POST",
      params: data
    });
  },
  // 未关联外部联系人列表
  externalContacts(data) {
    return http("customer/external_contacts", {
      method: "GET",
      params: data
    });
  },
  // 待保养客户
  customerMaintenance(data) {
    return http("customer/maintenance", {
      method: "GET",
      params: data
    });
  },
  // 会员卡到期
  customerExpire(data) {
    return http("customer/expire/" + data.type, {
      method: "GET",
      params: data
    });
  },
  // 获取签名
  commonAgentConfig(data) {
    return http("common/agentConfig" + data.type, {
      method: "POST",
      params: data
    });
  }
};
export default apis;
