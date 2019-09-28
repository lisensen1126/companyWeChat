import * as types from "./types";

export default {
  // replace staff with the latest copy
  [types.REFRESH_STORES]({ stores }, latest) {
    stores.splice(0, stores.length, ...latest);
  },
  [types.UPDATE_STORE] (state, currentStore) {
    state.currentStore = currentStore;
  }
};
