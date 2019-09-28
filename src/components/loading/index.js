import LoadingComponent from "./loading";

const Loading = {};

Loading.install = function(Vue) {
  const LoadingConstructor = Vue.extend(LoadingComponent);
  // 生成一个该子类的实例
  const instance = new LoadingConstructor();

  instance.$mount(instance.$el);
  document.body.appendChild(instance.$el);

  let loading = {};

  loading.show = function(msg) {
    instance.type = "success";
    instance.message = msg;
    instance.show = true;
  };
  loading.hide = () => {
    instance.show = false;
  };

  Vue.prototype.$loading = loading;
};

export default Loading;
