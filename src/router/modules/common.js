import Error from "@/views/default/LoginFail.vue";
import NoPage from "@/views/default/NoPage.vue";
import BusinessTool from "@/views/application/businessTool.vue";
import BusinessManage from "@/views/application/businessManage.vue";
import OperationSupport from "@/views/application/operationSupport.vue";
import SupportDetail from "@/views/application/supportDetail.vue"
import StaffPower from "@/views/application/staffPower.vue";

export default [
  {
    path: "/",
    name: "error",
    component: Error
  },
  {
    path: "/error",
    name: "default",
    component: Error
  },
  {
    path: "/no-allow",
    name: "no-allow",
    component: NoPage
  },
  {
    path: "/business-tool",    // 生意工具
    name: "business-tool",
    component: BusinessTool,
    meta: {
      title: "生意工具"
    }
  },
  {
    path: "/business-manage",    // 生意管理
    name: "business-manage",
    component: BusinessManage,
    meta: {
      title: "生意管理"
    }
  },
  {
    path: "/operation-support",   // 运营支持
    name: "operation-support",
    component: OperationSupport,
    meta: {
      title: "运营支持"
    }
  },
  {
    path: "/support-detail",   // 运营支持
    name: "support-detail",
    component: SupportDetail,
    meta: {
      title: "运营支持"
    }
  },
  {
    path: "/staff-power",     // 员工赋能
    name: "staff-power",
    component: StaffPower,
    meta: {
      title: "员工赋能"
    }
  }
];
