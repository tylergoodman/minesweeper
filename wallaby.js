var webpack = require('webpack');
var webpack_config = require('./webpack.config');

webpack_config.entry = undefined;
webpack_config.output = undefined;
webpack_config.devtool = undefined;
// webpack_config.module.loaders = undefined;
webpack_config.plugins.push(new webpack.IgnorePlugin(/\.scss$/));

module.exports = function(wallaby) {

  return {
    files: [
      'src/**/*.ts*',
      // {
      //   pattern: 'node_modules/react-tools/src/test/phantomjs-shims.js',
      //   instrument: false,
      // },
      // {
      //   pattern: 'src/**/*.ts*',
      //   load: false,
      // },
    ],

    tests: [
      'test/**/*.coffee',
      'test/**/*.ts*',
      // {
      //   pattern: 'test/**/*.coffee',
      //   load: false,
      // },
      // {
      //   pattern: 'test/**/*.ts*',
      //   load: false,
      // },
    ],

    compilers: {
      '**/*.ts*': wallaby.compilers.typeScript({
        module: 1,
        jsx: 2,
        target: 1,
        typescript: require('typescript'),
      }),
    },

    // postprocessor: require('wallaby-webpack')(webpack_config),
    //
    // bootstrap: function () {
    //   __moduleBundler.loadTests();
    // },

    debug: true,

    env: {
      type: 'node',
    //   type: 'browser',
    //   runner: 'phantomjs',
    },
  };
}
