import http from "../http";

let apis = {
  // 员工是否是第一次生成二维码
  getReadyApi(data) {
    return http("work/v1/offline_pay/visit_detail", {
      method: "POST",
      params: data
    });
  },

  // 获取门店收款码
  getStoreCodeApi(data) {
    return http("work/v1/offline_pay/qrcode", {
      method: "POST",
      params: data
    });
  },

  //  快速开单项目分类列表
  getOrderMenuApi(data) {
    return http("work/v1/offline_pay/quick_bill_category", {
      method: "POST",
      params: data
    });
  },

  // 线下买单支付成功订单列表
  getPayListApi(data) {
    return http("work/v1/order/offline_order_pay_list", {
      method: "POST",
      params: data
    });
  },

  // 快速开单项目：项目列表
  getBillListApi(data) {
    return http("work/v1/offline_pay/quick_bill_list", {
      method: "POST",
      params: data
    });
  },

  // 快速开单
  setOrderApi(data) {
    return http("work/v1/order/quick_order_insert", {
      method: "POST",
      params: data
    });
  },

  // 获取员工列表
  getStaffListApi(data) {
    return http("work/v1/permission/member", {
      method: "POST",
      params: data
    });
  },

  // 设置员工开单权限
  setStaffPwoerApi(data) {
    return http("work/v1/permission/bill", {
      method: "POST",
      params: data
    });
  },

  // 快速开单详情信息
  getOrderDetailApi(data) {
    return http("work/v1/order/quick_order_detail", {
      method: "POST",
      params: data
    });
  },

  // 快速开单支付成功通知
  getOrderMsgApi(data) {
    return http("work/v1/order/quick_order_pay_detail", {
      method: "POST",
      params: data
    });
  },

  // 快速开单记录
  getOrderListApi(data) {
    return http("work/v1/order/offline_order_list", {
      method: "POST",
      params: data
    });
  },

  // 收款记录详情
  getRecordDetailApi(data) {
    return http("work/v1/order/offline_order_detail", {
      method: "POST",
      params: data
    });
  },

  // 商品搜索列表
  getOfflineSearchApi(data) {
    return http("work/v1/offline_pay/search", {
      method: "POST",
      params: data
    });
  },

  // 历史搜索记录
  getHistoryApi(data) {
    return http("work/v1/offline_pay/search_record", {
      method: "POST",
      params: data
    });
  },

  // sku选择列表
  getSkuListApi(data) {
    return http("work/v1/offline_pay/sku_choice_detail", {
      method: "POST",
      params: data
    });
  },
};

export default apis;
