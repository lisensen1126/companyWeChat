import * as types from "./types";
import http from "@/http"

export default {
  synchronizeStores({ commit }) {
    http("work/v1/common/store_list").then(
      res => {
        if (res.status === 200 && res.code === 0) {
          commit(types.REFRESH_STORES, res.data);
          commit(types.UPDATE_STORE, res.data[0]);
        } else {
          logError("获取门店列表失败", res.response.status)
        }
      }
    )
  },
  updateCurStore ({commit}, message) {
    commit(types.UPDATE_STORE, message);
  },
};
