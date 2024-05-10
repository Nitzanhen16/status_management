module.exports = {
  configureWebpack: {
    devtool: "source-map"
  },
  devServer: {
    // host: "132.72.65.211"
    host: "localhost",
    port: 8082
  }
  // publicPath: process.env.NODE_ENV === "production" ? "/LAB12/" : "/"
};
