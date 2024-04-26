const path= require("path");

module.exports = {

  mode: "development", //mode of the webpack
  entry: "./src/app.ts",
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), //global path to dist folder
    publicPath: "/dist/", //relative path to dist folder
  },
  devtool: "inline-source-map", //source map to debug
  module: {
    rules: [
      {
        test: /\.ts$/, //regular expression to find all ts files
        use: "ts-loader", //use ts-loader to compile ts files
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], //extensions to be compiled
  },
};