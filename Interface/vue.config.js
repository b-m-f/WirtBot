const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
  publicPath: "./",
  transpileDependencies: [],
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss";`,
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  chainWebpack: (config) => {
    config
      // TODO: 16.3 check if still needed for Edge browser https://rustwasm.github.io/docs/wasm-bindgen/examples/hello-world.html
      .plugin("text-encoder")
      .use(webpack.ProvidePlugin)
      .init(
        (Plugin) =>
          new Plugin({
            TextDecoder: ["text-encoding", "TextDecoder"],
            TextEncoder: ["text-encoding", "TextEncoder"],
          })
      )
      .end()
      .plugin("bundle analyzer")
      .use(BundleAnalyzerPlugin)
      .init(
        (Plugin) =>
          new Plugin({
            analyzerMode: "static",
            reportFilename: "bundle-size-analysis",
            openAnalyzer: false,
          })
      )
      .end()
      .plugin("wasm")
      .use(
        new WasmPackPlugin({
          crateDirectory: `${__dirname}/src/lib/crate`,
        })
      )
      .end()
      .module.rule("md")
      .test(/\.md/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler")
      .options({
        raw: true,
      });

    config.resolve.alias.set(
      "components",
      path.join(__dirname, "src/components")
    );
  },
};
