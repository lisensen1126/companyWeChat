import mutations from "./mutations";
import actions from "./actions";

const state = {
  stores: [],
  currentStore: {},
};
// const getters = {
//   // 请求数据时加载状态
//   olist: state => state.olist,
//   massageCount: state => state.massageCount,
// }
export default {
  // getters,
  state,
  mutations,
  actions
};
