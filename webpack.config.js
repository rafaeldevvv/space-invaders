const path = require('path');

module.exports = {
   mode: "development",
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
            use: ["style-loader", "css-loader"],
            exclude: /node_modules/,
         }
      ],
   },
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "/src/"),
      }
   },
   stats: {
      errorDetails: true
   },
   resolve: {
      extensions: [".ts", ".js"],
      modules: ["src"]
   }
};