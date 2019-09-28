module.exports = {
  baseUrl:
    process.env.NODE_ENV === "development"
      ? process.env.VUE_APP_CORP_ID + "/" + process.env.VUE_APP_IDENTIFIER
      : "",
  assetsDir: "static",
  configureWebpack: config => {
    require("vux-loader").merge(config, {
      options: {},
      plugins: ["vux-ui"]
    });
  }
};
