import Api from "@/api/payReduction";
export default {
  methods: {
    // 遇到错误后重新跳转页面的方法
    goRightPage() {
      let steps = ["intro", "one", "two", "three", "four", "done"]; // 根据接口返回值来确定跳转的页面
      this.$loading.show("加载中");
      Api.getApplyStatus().then(
        res => {
          if (res.code === 0) {
            this.$loading.hide();
            setTimeout(() => {
              this.$router.replace({
                name: "apply-step-" + steps[res.data.step]
              });
            }, 1500);
          } else if (res.code === 41231 || res.code === 41230) {
            this.$toast.warning(res.message, 1500);
            setTimeout(() => {
              this.$router.replace({
                name: "business-manage"
              });
            }, 1500);
          } else {
            setTimeout(() => {
              this.$router.replace({
                path: "/error",
                query: {
                  msg: res.message
                }
              });
            }, 1500);
          }
        },
        err => {
          this.$router.replace({
            path: "/error",
            query: {
              msg: err
            }
          });
        }
      );
    },
    /**
     * 更新报名信息的方法
     * @param {Object} query  向接口传递的参数
     * @param {String} pageName  接口请求成功后跳转的页面name
     */
    updateInfo(query, pageName) {
      this.$loading.show("加载中");
      Api.applyUpdate(query).then(
        res => {
          this.$loading.hide();
          if (res.code === 0) {
            this.$router.replace({
              name: pageName
            });
          } else if (res.code === 41231 || res.code === 41230) {
            // 如果报名的过程中，报名结束，则给出提示并跳到首页
            this.$toast.warning(res.message, 1500);
            setTimeout(() => {
              this.$router.replace({
                path: "/business-manage"
              });
            }, 1500);
          } else if (res.code === 41232) {
            this.$toast.warning(res.message, 1500);
            this.goRightPage();
          }
        },
        err => {
          this.$loading.hide();
          this.$router.replace({
            path: "/error",
            query: {
              msg: err
            }
          });
        }
      );
    }
  }
};
