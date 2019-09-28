import VehicleAssistant from "@/views/vehicleDiagnosis/VehicleAssistant.vue";
import CustomerSearch from "@/views/vehicleDiagnosis/CustomerSearch.vue";
import StartCheck from "@/views/vehicleDiagnosis/StartCheck.vue";
import NewCustomer from "@/views/vehicleDiagnosis/NewCustomer.vue";
import CustomerInfo from "@/views/vehicleDiagnosis/CustomerInfo.vue";
import DiagnosisInfo from "@/views/vehicleDiagnosis/DiagnosisRecord.vue";
import AppDiagnosisInfo from "@/views/vehicleDiagnosis/AppDiagnosisRecord.vue";
import DiagnosisList from "@/views/vehicleDiagnosis/DiagnosissList.vue";
import AppDiagnosisList from "@/views/vehicleDiagnosis/AppDiagnosissList.vue";
import PolymerDiagnosisList from "@/views/vehicleDiagnosis/PolymerDiagnosisList.vue";
import PolymerDiagnosisDetail from "@/views/vehicleDiagnosis/PolymerDiagnosisDetail.vue";
import VehicleCheckType from "@/views/vehicleDiagnosis/VehicleCheckType.vue";
import CheckSuccess from "@/views/vehicleDiagnosis/CheckSuccess.vue";
import SelectingVehicle from "@/views/vehicleDiagnosis/SelectingVehicle.vue";
export default [
  {
    path: "/vehicle-assistant",
    name: "vehicle-assistant",
    component: VehicleAssistant,
    meta: {
      title: "车检帮手"
    }
  },
  {
    path: "/vehiclediagnosis",
    name: "diagnosis",
    component: CustomerSearch,
    meta: {
      title: "车检帮手"
    }
  },
  {
    path: "/startcheck",
    name: "startcheck",
    component: StartCheck,
    meta: {
      title: "车检场景"
    }
  },
  {
    path: "/newcustomer",
    name: "createcus",
    component: NewCustomer,
    meta: {
      title: "新增客户"
    }
  },
  {
    path: "/customerinfo",
    name: "cusinfo",
    component: CustomerInfo,
    meta: {
      title: "客户信息"
    }
  },
  {
    path: "/diagnosisinfo",
    name: "diainfo",
    component: DiagnosisInfo,
    meta: {
      title: "车检详情"
    }
  },
  {
    path: "/appdiagnosisinfo",
    name: "appdiagnosisinfo",
    component: AppDiagnosisInfo,
    meta: {
      title: "车检报告详情"
    }
  },
  {
    // polymer-disgnosis-detail
    path: "/polymer-disgnosis-detail",
    name: "polymer-disgnosis-detail",
    component: PolymerDiagnosisDetail,
    meta: {
      title: "车检报告详情"
    }
  },
  {
    path: "/diagnosislist",
    name: "dialist",
    component: DiagnosisList,
    meta: {
      title: "车检记录"
    }
  },
  {
    path: "/appdiagnosislist",
    name: "appdiagnosislist",
    component: AppDiagnosisList,
    meta: {
      title: "我的车检记录"
    }
  },
  {
    path: "/polymer-diagnosislist",
    name: "polymer-diagnosislist",
    component: PolymerDiagnosisList,
    meta: {
      title: "我的车检记录"
    }
  },
  {
    path: "/vehiclechecktype",
    name: "vehiclechecktype",
    component: VehicleCheckType,
    meta: {
      title: "选择车检类型"
    }
  },
  {
    path: "/checksuccess",
    name: "checksuccess",
    component: CheckSuccess,
    meta: {
      title: "检测完成"
    }
  },
  {
    path: "/SelectingVehicle",
    name: "SelectingVehicle",
    component: SelectingVehicle,
    meta: {
      title: "选择车检单"
    }
  }
];
