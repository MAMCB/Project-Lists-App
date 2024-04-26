const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production", //mode of the webpack
  entry: "./src/app.ts",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), //global path to dist folder
  },
  
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
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(), //to clean the dist folder before building so we always have the latest build
  ],
};
