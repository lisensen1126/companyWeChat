import http from "../http";

let apis = {
  getQRCode(params) {
    return http("work/v1/qr_code/share", {
      method: "GET",
      params: params
    });
  },
  relayQRCode(params) {
    return http("work/v1/qr_code/relay", {
      method: "POST",
      params: params
    });
  }
};
export default apis;
