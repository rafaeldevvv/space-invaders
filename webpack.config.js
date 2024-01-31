const path = require('path');
const Terser = require("terser-webpack-plugin");

module.exports = {
   mode: "production",
   entry: './src/index.ts',
   // devtool: 'inline-source-map',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
            exclude: /node_modules/,
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif|wav|mp3)$/i,
            type: 'asset/resource',
         },
      ],
   },
   resolve: {
      extensions: ['.ts', '.js'],
      alias: {
         "@": path.resolve(__dirname, "./src"),
      }
   },
   stats: {
      errorDetails: true
   },
   optimization: {
      minimize: true,
      minimizer: [new Terser({
         minify: Terser.uglifyJsMinify
      })]
   }
};