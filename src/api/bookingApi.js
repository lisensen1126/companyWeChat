import http from "../http";

let apis = {
  // 预约列表
  getAppointmentList(data) {
    return http("work/v1/reserve/list", {
      method: "GET",
      params: data
    });
  },
  // 预约详情
  getAppointmentDetail(data) {
    return http("work/v1/reserve/detail", {
      method: "GET",
      params: data
    });
  },
  // 预约详情
  getAppointmentDetailApi(data) {
    return http("work/v1/order/write_off_detail", {
      method: "POST",
      params: data
    });
  },
  // 确认核销
  setWriteOffApi(data) {
    return http("work/v1/order/write_off", {
      method: "POST",
      params: data
    });
  },
  // 保养卡确认核销
  setCardWriteOffApi(data) {
    return http("work/v1/upkeep/validate_new", {
      method: "POST",
      params: data
    });
  },
  // 次卡确认核销
  setCardWriteOffSingleApi(data) {
    return http("work/v1/upkeep/validate_time", {
      method: "POST",
      params: data
    });
  },
  // 客户车辆信息 customer/vehicles
  getCustomerCarListApi(data) {
    return http("work/v1/customer/vehicles", {
      method: "GET",
      params: data
    });
  },
  // 添加车辆里程
  addCarMileage(data) {
    return http("work/v1/reserve/vehicle-mileage-record-add", {
      method: "POST",
      params: data
    });
  },
  // 用户优惠券详情
  getCouponDetailApi(data) {
    return http("work/v1/coupon/write_off_detail", {
      method: "POST",
      params: data
    });
  },
  // 核销优惠券
  setCouponWriteOffApi(data) {
    return http("work/v1/coupon/write_off", {
      method: "POST",
      params: data
    });
  }
};

export default apis;
