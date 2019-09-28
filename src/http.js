/* eslint-disable */
//引入axios

import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import AppConfig from "./app.config";
import AppBase from "./app.base";

Vue.use(VueAxios, axios);
console.log(process.env.NODE_ENV);
let API_ROOT = AppBase.base_url;
// 添加请求拦截器
Vue.axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  // console.log("请求错误")
  return Promise.reject(error);
});

// 添加响应拦截器
Vue.axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let {
    data
  } = response;
  // 用户未登陆
  if (data.code && data.code == "10001") {
    window.location.replace(window.location.href)
  }
  return data;
}, function (err) {
  // 对响应错误做点什么
  let error = {};
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        error.message = `[${err.response.status}]错误请求`;
        break;
      case 401:
        error.message = `[${err.response.status}]未授权，请重新登录`;
        break;
      case 403:
        err.message = `[${err.response.status}]拒绝访问`;
        break;
      case 404:
        err.message = `[${err.response.status}]请求错误,未找到该资源`;
        break;
      case 405:
        err.message = `[${err.response.status}]请求方法未允许`;
        break;
      case 408:
        err.message = `[${err.response.status}]请求超时`;
        break;
      case 500:
        err.message = `[${err.response.status}]服务器端出错`;
        break;
      case 501:
        err.message = `[${err.response.status}]网络未实现`;
        break;
      case 502:
        err.message = `[${err.response.status}]网络错误`;
        break;
      case 503:
        err.message = `[${err.response.status}]服务不可用`;
        break;
      case 504:
        err.message = `[${err.response.status}]网络超时`;
        break;
      case 505:
        err.message = `[${err.response.status}]http版本不支持该请求`;
        break;
      default:
        err.message = `[${err.response.status}]连接错误`;
    }
  } else {
    error.message = "连接到服务器失败";
  }
  return Promise.reject(err.message);
});


let http = (path, options = {}, timeout = 10000) => {
  let method = options.method ? options.method.toUpperCase() : "POST";
  let resolve = null;
  let reject = null;
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  path = path + '?corp_id=' + AppConfig.corp_id + '&app_identifier=' + AppConfig.app_identifier;
  try {
    Vue.axios({
      method: method,
      url: path,
      baseURL: API_ROOT,
      data: method === 'POST' || method === 'PUT' ? options.params : null,
      params: method === 'GET' || method === 'DELETE' ? options.params : null,
      timeout: timeout,
      withCredentials: true,
      // transformRequest: [function (data) {
      //   return data
      //   // let ret = "";
      //   // for (let it in data) {
      //   //   ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&"
      //   // }
      //   // return ret.substring(0, ret.length - 1)
      // }],
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err)
    });
  } catch (err) {
    reject(err)
  }

  return promise
}
export default http;