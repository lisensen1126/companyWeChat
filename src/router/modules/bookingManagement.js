import BookingList from "@/views/bookingManagement/BookingList.vue";
import WriteOffDetails from "@/views/bookingManagement/WriteOffDetails.vue";
import WriteOffSuccess from "@/views/bookingManagement/WriteOffSuccess.vue";
import WriteOffSearch from "@/views/bookingManagement/WriteOffSearch.vue";
import WriteOffSure from "@/views/bookingManagement/WriteOffSure.vue";
import WriteOffCard from "@/views/bookingManagement/WriteOffCard.vue";
import WriteOffCardSure from "@/views/bookingManagement/WriteOffCardSure.vue";
import ChooseItem from "@/views/bookingManagement/ChooseItem.vue";
import GoodsRecord from "@/views/bookingManagement/GoodsRecord.vue";

export default [
  {
    path: "/bookingManagement",
    name: "bookingList",
    component: BookingList,
    meta: {
      title: "核销"
    }
  },
  {
    path: "/bookingManagement/writeOffDetails",
    name: "WriteOffDetails",
    component: WriteOffDetails,
    meta: {
      title: "订单详情"
    }
  },
  {
    path: "/bookingManagement/writeOffSure",
    name: "WriteOffSure",
    component: WriteOffSure,
    meta: {
      title: "核销确认"
    }
  },
  {
    path: "/bookingManagement/writeOffSuccess",
    name: "WriteOffSuccess",
    component: WriteOffSuccess,
    meta: {
      title: "核销成功"
    }
  },
  {
    path: "/bookingManagement/writeOffSearch",
    name: "WriteOffSearch",
    component: WriteOffSearch,
    meta: {
      title: "搜索"
    }
  },
  {
    path: "/bookingManagement/writeOffCard",
    name: "writeOffCard",
    component: WriteOffCard,
    meta: {
      title: "核销确认"
    }
  },
  {
    path: "/bookingManagement/writeOffCardSure",
    name: "writeOffCardSure",
    component: WriteOffCardSure,
    meta: {
      title: "核销确认"
    }
  },
  {
    path: "/bookingManagement/choose-item",
    name: "choose-item",
    component: ChooseItem,
    meta: {
      title: "选择核销项目"
    }
  },
  {
    path: "/bookingManagement/goods-record",
    name: "goods-record",
    component: GoodsRecord,
    meta: {
      title: "核销记录"
    }
  }
];
