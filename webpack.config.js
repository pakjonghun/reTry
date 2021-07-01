const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    list: "./src/public/javascript/list.js",
    add: "./src/public/javascript/add.js",
    post: "./src/public/javascript/post.js",
    comment: "./src/public/javascript/comment.js",
    index: "./src/public/css/index.css",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/index.css",
    }),
  ],
  output: {
    filename: "javascript/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
