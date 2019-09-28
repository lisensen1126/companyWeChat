<template>
  <default-page picture="system"
                :text="msg"></default-page>
</template>

<script>
import defaultPage from "../../components/default.vue";
export default {
  name: "loginFail",
  components: {
    defaultPage
  },
  data() {
    return {
      msg: "系统异常，请稍后再试"
    };
  },
  created() {
    if (this.$route.query.hasOwnProperty("msg")) {
      this.msg = this.$route.query.msg.toString();
    }
  }
};
</script>
