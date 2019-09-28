import OfflineMenu from "@/views/offlineBooking/Index.vue";
import StorePayCode from "@/views/offlineBooking/StorePayCode.vue"; // 门店收款码
import ReceivablesList from "@/views/offlineBooking/ReceivablesList.vue"; // 收款记录列表
import ReceivablesSearch from "@/views/offlineBooking/ReceivablesSearch.vue"; // 收款记录搜索列表
import ReceivablesDetail from "@/views/offlineBooking/ReceivablesDetail.vue"; // 收款记录详情
import StaffManageList from "@/views/offlineBooking/StaffManageList.vue"; // 员工开单权限管理列表
import OpeningOrderList from "@/views/offlineBooking/OpeningOrderList.vue"; // 快速开单列表
import OpeningOrderConfirm from "@/views/offlineBooking/OpeningOrderConfirm.vue"; // 快速开单列表
import OpeningOrderSearch from "@/views/offlineBooking/OpeningOrderSearch.vue"; // 快速开单搜索列表
import OpeningOrderCreat from "@/views/offlineBooking/OpeningOrderCreat.vue"; // 快速创建开单项目
import OpeningRecordList from "@/views/offlineBooking/OpeningRecordList.vue"; // 快速开单记录列表
import OpeningRecordSearch from "@/views/offlineBooking/OpeningRecordSearch.vue"; // 快速开单记录搜索
import OpeningRecordDetail from "@/views/offlineBooking/OpeningRecordDetail.vue"; // 快速开单记录详情
import OpeningOrderPay from "@/views/offlineBooking/OpeningOrderPay.vue"; // 快速开单扫码界面

export default [
  {
    path: "/offlineIndex",
    name: "OfflineMenu",
    component: OfflineMenu,
    meta: {
      title: "线下买单"
    }
  },
  {
    path: "/offlinePay/payCode",
    name: "StorePayCode",
    component: StorePayCode,
    meta: {
      title: "门店收款码"
    }
  },
  {
    path: "/receivables/list",
    name: "ReceivablesList",
    component: ReceivablesList,
    meta: {
      title: "收款记录"
    }
  },
  {
    path: "/receivables/search",
    name: "ReceivablesSearch",
    component: ReceivablesSearch,
    meta: {
      title: "指定日期查询"
    }
  },
  {
    path: "/receivables/detail",
    name: "ReceivablesDetail",
    component: ReceivablesDetail,
    meta: {
      title: "收款记录"
    }
  },
  {
    path: "/staff/manage",
    name: "StaffManageList",
    component: StaffManageList,
    meta: {
      title: "员工开单管理"
    }
  },
  {
    path: "/opening/list",
    name: "OpeningOrderList",
    component: OpeningOrderList,
    meta: {
      title: "快速开单"
    }
  },
  {
    path: "/opening/confirm",
    name: "OpeningOrderConfirm",
    component: OpeningOrderConfirm,
    meta: {
      title: "清单项目确认"
    }
  },
  {
    path: "/opening/search",
    name: "OpeningOrderSearch",
    component: OpeningOrderSearch,
    meta: {
      title: "快速开单"
    }
  },
  {
    path: "/opening/create",
    name: "OpeningOrderCreat",
    component: OpeningOrderCreat,
    meta: {
      title: "手动创建"
    }
  },
  {
    path: "/opening/recordList",
    name: "OpeningRecordList",
    component: OpeningRecordList,
    meta: {
      title: "开单收款记录"
    }
  },
  {
    path: "/opening/recordSearch",
    name: "OpeningRecordSearch",
    component: OpeningRecordSearch,
    meta: {
      title: "指定日期查询"
    }
  },
  {
    path: "/opening/recordDetail",
    name: "OpeningRecordDetail",
    component: OpeningRecordDetail,
    meta: {
      title: "记录详情"
    }
  },
  {
    path: "/opening/pay",
    name: "OpeningOrderPay",
    component: OpeningOrderPay,
    meta: {
      title: "快速开单"
    }
  }
];
