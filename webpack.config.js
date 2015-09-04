var webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: './lib',
    filename: 'minesweeper.js',
    library: 'Minesweeper',
  },

  devServer: {
    contentBase: "./lib",
    publicPath: "/",
    colors: true,
  },

  bail: true,
  debug: true,
  node: {
    fs: 'empty',
  },

  devtool: 'inline-source-map',

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    loaders: [{
        test: /\.gif$/,
        loader: 'url?limit=10000&mimetype=image/gif',
      },
      {
        test: /\.jpg$/,
        loader: 'url?limit=10000&mimetype=image/jpg',
      },
      {
        test: /\.png$/,
        loader: 'url?limit=10000&mimetype=image/png',
      },
      {
        test: /\.svg$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.scss$/,
        loader: "style!css!sass",
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts',
        // loader: 'typescript-simple',
        query: {
          transpileOnly: true,
        },
      },
    ],
  },
};
