import http from "../http";
export default {
  // 获取当前报名步骤接口
  getApplyStatus() {
    return http("work/v1/apply/cur_step", {
      method: "GET"
    });
  },
  // 立即报名
  applyCreate() {
    return http("work/v1/apply/create", {
      method: "POST"
    });
  },
  // 更新报名信息
  applyUpdate(params) {
    return http("work/v1/apply/update", {
      method: "POST",
      params
    });
  },
  // 获取报名信息详情
  getApplyInfo() {
    return http("work/v1/apply/detail", {
      method: "GET"
    });
  },
  // 上传图片
  uploadPicApi(data) {
    let formdata = new FormData();
    formdata.append("file", data.file);
    return http(
      "work/v1/common/image_upload",
      {
        method: "POST",
        params: formdata
      },
      60000
    );
  }
};
