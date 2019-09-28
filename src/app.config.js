/**
 * 解析url
 */

/**
 * 配置允许外部模块访问逻辑
 */

/**
 * ------------------------------------------------------
 * 允许外部人员访问的模块
 */
let Allow_Outer_Module_Config = [
  "article-detail",
  "spread",
  "prefer",
  "card",
  "mycard",
  "invite-evaluation",
  "customer-card",
  "shell"
];
// true 表示允许外部人员访问 false 不允许外部人员访问
let isAllowModule = function(path) {
  for (let i = 0; i < Allow_Outer_Module_Config.length; i++) {
    let module = Allow_Outer_Module_Config[i].toLowerCase();
    if (path.indexOf("/" + module) >= 0) {
      return true;
    }
  }
  return false;
};

/**
 * ------------------------------------------------------
 *  菜单项分享特殊处理
 **/

let Share_Module_Config = [ "article-detail"];
let isShareMoule = function(path) {
  for (let i = 0; i < Share_Module_Config.length; i++) {
    let module = Share_Module_Config[i].toLowerCase();
    if (path.indexOf("/" + module) >= 0) {
      return true;
    }
  }
  return false;
};

/**
 * ------------------------------------------------------
 *  判断是否是外部员工
 **/

let isStaff = false;
// true 表示企业内部员工 false 非企业人员
let isOuterUser = function(data) {
  isStaff = data.hasOwnProperty("member");
  return data.hasOwnProperty("member");
};

/**
 * ------------------------------------------------------
 *  配置 api
 **/
let jsApiList = [
  "hideMenuItems", // 批量隐藏功能按钮
  "showMenuItems", // 批量显示功能按钮
  "hideAllNonBaseMenuItem", // 隐藏所有非基础按钮
  "showAllNonBaseMenuItem", // 显示所有功能按钮
  "showOptionMenu",
  "hideOptionMenu",
  "onMenuShareAppMessage",
  "onMenuShareWechat",
  "selectExternalContact",
  "onMenuShareTimeline",
  "chooseImage",
  "previewImage",
  "uploadImage",
  "downloadImage",
  "getLocalImgData",
  "scanQRCode"
];
let user = {};

export default {
  enterprise_id: "",
  corp_id: "",
  app_identifier: "",
  isLogin: false,
  user,
  isStaff,
  jsApiList,
  isAllowModule,
  isOuterUser,
  isShareMoule
};
