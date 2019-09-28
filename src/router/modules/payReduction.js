import ApplyIntro from "@/views/payReduction/ApplyIntro.vue";
import IntroDetail from "@/views/payReduction/IntroDetail.vue";
import ApplyStepOne from "@/views/payReduction/ApplyStepOne.vue";
import ApplyStepTwo from "@/views/payReduction/ApplyStepTwo.vue";
import ApplyStepThree from "@/views/payReduction/ApplyStepThree.vue";
import ApplyStepFour from "@/views/payReduction/ApplyStepFour.vue";
import ApplyDone from "@/views/payReduction/ApplyDone.vue";

export default [
  {
    path: "/apply-step-intro",
    name: "apply-step-intro",
    component: ApplyIntro,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  },
  {
    path: "/intro-detail",
    name: "intro-detail",
    component: IntroDetail,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  },
  {
    path: "/apply-step-one",
    name: "apply-step-one",
    component: ApplyStepOne,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  },
  {
    path: "/apply-step-two",
    name: "apply-step-two",
    component: ApplyStepTwo,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  },
  {
    path: "/apply-step-three",
    name: "apply-step-three",
    component: ApplyStepThree,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  },
  {
    path: "/apply-step-four",
    name: "apply-step-four",
    component: ApplyStepFour,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  },
  {
    path: "/apply-step-done",
    name: "apply-step-done",
    component: ApplyDone,
    meta: {
      title: "壳保养智慧支付活动报名"
    }
  }
];
