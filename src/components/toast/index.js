import toastComponent from "./toast";

const Toast = {};

Toast.install = function(Vue) {
  const ToastConstructor = Vue.extend(toastComponent);
  // 生成一个该子类的实例
  const instance = new ToastConstructor();

  instance.$mount(instance.$el);
  document.body.appendChild(instance.$el);

  let toast = {};

  toast.show = (msg, duration = 2000, type = "success") => {
    instance.type = type;
    instance.message = msg;
    instance.show = true;

    setTimeout(() => {
      instance.show = false;
    }, duration);
  };

  toast.success = (msg, duration = 2000) => {
    toast.show(msg, duration, "success");
  };

  toast.warning = (msg, duration = 2000) => {
    toast.show(msg, duration, "warning");
  };

  toast.error = (msg, duration = 2000) => {
    toast.show(msg, duration, "error");
  };

  toast.hide = () => {
    instance.show = false;
  };

  Vue.prototype.$toast = toast;
};

export default Toast;
