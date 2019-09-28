import Vue from "vue";
import Router from "vue-router";
import Routes from "./router/index";
import AppConfig from "./app.config";
import Api from "@/api/commonApi";
Vue.use(Router);

/**
 * 根据code获取用户信息  wx.config 进行权限验证配置, 注入的是企业的身份与权限
 * @param {*} url 
 * @param {*} path 
 */
let wxConfig = function(url, path) {
  Api.getConfig({
    url: url
  }).then(function(res) {
    if (res.data) {
      wx.config({
        beta: true,
        debug: false,
        appId: res.data.appid,
        timestamp: res.data.timestamp,
        nonceStr: res.data.noncestr,
        signature: res.data.signature,
        jsApiList: AppConfig.jsApiList
      });
      wx.ready(function() {
        console.log("微信sdk成功");
        // wxAgentConfig(url);
        if (AppConfig.isShareMoule(path)) {
          wx.showMenuItems({
            menuList: [
              "menuItem:share:timeline",
              "menuItem:share:wechat",
              "menuItem:share:appMessage"
            ]
          });
        } else {
          wx.hideAllNonBaseMenuItem();
        }
      });
      wx.error(function(res) {
        console.log(res);
      });
    }
  });
};

/**
 * 通过agentConfig注入应用的权限, 注入的是应用的身份与权限
 * @param {*} url 
 * @param {*} path 
 */
let wxAgentConfig = function(url, path) {
  Api.getAgentConfig({
    url: url
  }).then(function(res) {
    if (res.data) {
      wx.agentConfig({
        corpid: res.data.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
        agentid: res.data.agentId, // 必填，企业微信的应用id
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名，见附录1
        jsApiList: ['selectExternalContact'], //必填
        success: function (res) {
          let str = JSON.stringify(res)
          console.log('agentConfig成功' + str)
        },
        fail: function(err) {
          let error = JSON.stringify(err)
          console.log('agentConfig失败' + error)
        }
      })
    }
  });
};

// 标题设置
let setTitle = function(title, next) {
  if (title) {
    document.title = title;
  }
  next();
};
// 用户信息处理
let userHandle = function(to, next, res) {
  AppConfig.isLogin = true;
  AppConfig.user = res.data;
  if (AppConfig.isAllowModule(to.path)) {
    setTitle(to.meta.title, next);
  } else {
    if (AppConfig.isOuterUser(res.data)) {
      setTitle(to.meta.title, next);
    } else {
      router.replace("/no-allow");
    }
  }
};
AppConfig.corp_id = window.location.pathname.split("/")[1];
AppConfig.app_identifier = window.location.pathname.split("/")[2];
let router = new Router({
  mode: "history",
  base: AppConfig.corp_id + "/" + AppConfig.app_identifier,
  routes: Routes
});

router.beforeEach((to, from, next) => {
  if (
    to.path === "/error" ||
    to.path === "/no-allow" ||
    (from.path !== "/" && AppConfig.isLogin)
  ) {
    setTitle(to.meta.title, next);
  } else {
    if (AppConfig.isLogin) {
      setTitle(to.meta.title, next);
    } else if (to.name === "appdiagnosislist" || to.name === "appdiagnosisinfo" || to.name === "polymer-diagnosislist" || to.name === "polymer-disgnosis-detail") {
      setTitle(to.meta.title, next);
    } else {
      let params = to.query;
      if (params.hasOwnProperty("code") && !!params.code) {
        Api.getLogin({
          code: params.code,
          url: window.location.href
        }).then(function(res) {
          if (res.data) {
            userHandle(to, next, res);
          } else {
            router.replace({
              path: "/error",
              query: {
                msg: "code授权失败，请重新再试"
              }
            });
          }
        });
      } else {
        Api.getLogin({
          redirect_uri: window.location.href,
          url: window.location.href
        }).then(function(res) {
          if (res.code === 0) {
            if (res.data.auth_url) {
              // 微信授权验证
              if (process.env.NODE_ENV !== "development") {
                window.document.location.replace(res.data.auth_url);
                // document.getElementById("authRequestFrame").src = res.data.auth_url;
              } else {
                router.replace({
                  path: "/error",
                  query: {
                    msg: "开发环境，没有进行模拟登陆"
                  }
                });
              }
            } else {
              userHandle(to, next, res);
            }
          } else {
            router.replace({
              path: "/error",
              query: {
                msg: `[${res.code}]${res.message}`
              }
            });
          }
        });
      }
    }
  }
});

router.afterEach(to => {
  let url =
    window.location.origin +
    "/" +
    AppConfig.corp_id +
    "/" +
    AppConfig.app_identifier +
    to.fullPath;
  console.log(url);
  wxConfig(url, to.path);
});
export default router;
