import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueScroller from "vue-scroller";
import loading from "./components/loading";
import Toast from "./components/toast";
import Filter from './filter'
import { Upload } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import 'swiper/dist/css/swiper.css';
/*引入公共样式*/
import "./less/style.less";

Vue.use(VueScroller);
Vue.use(loading);
Vue.use(Upload)
Vue.use(Toast);
// 使用自定义过滤器
Vue.use(Filter)
Vue.config.productionTip = false;
new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount("#app");
