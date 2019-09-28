module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 强制使用一致的反勾号、双引号或单引号
    "quotes": ["error", "double", "avoid-escape"],
    // 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
    "no-empty-function": "error",
    // 强制在对象字面量的属性中键和值之间使用一致的间距
    "key-spacing": [2, {
      "beforeColon": false,
      "afterColon": true
    }],
    // 禁用行尾空格
    "no-trailing-spaces": "error",
    "no-console": "off",
    "no-debugger": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  globals: {
    wx: true,
    Vue: true
  },
};