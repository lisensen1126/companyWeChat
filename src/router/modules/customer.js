import CustomerList from "@/views/customer/CustomerList.vue";
import CustomerListNew from "@/views/customer/CustomerListNew.vue";
import CustomerDetail from "@/views/customer/CustomerDetail.vue";
import CustomerInfomation from "@/views/customer/CustomerInfomation.vue";
import CustomerCard from "@/views/customer/CustomerCard.vue";
import CardDetail from "@/views/customer/CardDetail.vue";
export default [
  {
    path: "/customer",
    name: "customer",
    component: CustomerList,
    meta: {
      title: "客户管理"
    }
  },
  {
    path: "/customer-new",
    name: "customer-new",
    component: CustomerListNew,
    meta: {
      title: "客户管理"
    }
  },
  {
    path: "/customer-detail",
    name: "customer-detail",
    component: CustomerDetail,
    meta: {
      title: "客户详情"
    }
  },
  {
    path: "/customer-infomation",
    name: "customer-infomation",
    component: CustomerInfomation,
    meta: {
      title: "客户资料"
    }
  },
  {
    path: "/customer-card",
    name: "customer-card",
    component: CustomerCard,
    meta: {
      title: "我的名片"
    }
  },
  {
    path: "/card-detail",
    name: "card-detail",
    component: CardDetail,
    meta: {
      title: "卡详情"
    }
  }
];
