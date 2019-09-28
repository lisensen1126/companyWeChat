import http from "../http";
import Mock from "../mock";

let apis = {
  // 搜索用户列表
  getCustomerList(params) {
    return http("work/v1/inspect/customer/search", {
      method: "GET",
      params: params
    });
  },
  // 模糊检索用户列表
  getAllCustomerList(params) {
    return http("work/v1/inspect/customer/search_all", {
      method: "POST",
      params: params
    });
  },
  // 获取车检报告详情
  getDiagnosisReport(params) {
    return http("work/v1/inspect/process/detail", {
      method: "GET",
      params: params
    });
  },
  // 小程序获取车检报告详情
  getDiagnosisReportApi(params) {
    return http("work/v1/inspect/process/mini_detail", {
      method: "GET",
      params: params
    });
  },
  // 获取技师车检报告列表
  getDiagnosisList(params) {
    return http("work/v1/inspect/customer/js_list", {
      method: "GET",
      params: params
    });
  },
  // 获取用户车检报告列表
  getCusDiagnosisList(params) {
    return http("work/v1/inspect/process/list", {
      method: "GET",
      params: params
    });
  },
  // 门店小程序获取用户车检报告列表
  getCusDiagnosisListApi(params) {
    return http("work/v1/inspect/process/mini_list", {
      method: "GET",
      params: params
    });
  },
  // 平台小程序获取车检报告列表
  getHubCusDiagnosisListApi(params) {
    return http("work/v1/inspect/process/hub_mini_list", {
      method: "GET",
      params: params
    });
  },
  // 平台小程序获取车检报告搜索列表
  getHubSearchListApi(params) {
    return http("work/v1/inspect/process/hub_mini_search", {
      method: "GET",
      params: params
    });
  },
  // 新建用户
  newCustomer(params) {
    return http("work/v1/inspect/customer/create", {
      method: "GET",
      params: params
    });
  },
  // 获取用户详情
  getCustomerDetail(params) {
    return http("work/v1/inspect/customer/detail", {
      method: "GET",
      params: params
    });
  },
  // 车检首页
  // processIndexApi() {
  //   return http("work/v1/inspect/process/index", {
  //     method: "GET"
  //   });
  // },
  // 车检流程要获取的详情
  processInspectApi(data) {
    return http("work/v1/inspect/detail", {
      method: "GET",
      params: data
    });
  },
  // 生成车检报告
  processGenerateApi(data) {
    console.log(data);
    return http("work/v1/inspect/generate_report", {
      method: "POST",
      params: data
    });
  },
  // 判断身份
  isLoginApi (data) {
    return http("work/v1/common/check_role", {
      method: "POST",
      params: data
    });
  },
  // 上传图片
  uploadPicApi(data) {
    let formdata = new FormData()
    formdata.append("file", data.file)
    return http("work/v1/common/image_upload", {
      method: "POST",
      params: formdata
    });
  },
  // 上传图片
  uploadVideoApi(data) {
    let formdata = new FormData()
    formdata.append("file", data.file)
    return http("work/v1/common/video_upload", {
      method: "POST",
      params: formdata
    });
  },
  // 扫描车牌号
  ocrLicensePlate(params) {
    return http("work/v1/inspect/customer/ocr_license_plate", {
      method: "POST",
      params: params
    });
  },

  // 车检单列表 
  processIndexApi() {
    return http("work/v1/inspect/list", {
      method: "GET"
    });
  },
};

export default apis;
