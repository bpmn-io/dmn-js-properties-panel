var path = require('path');

var absoluteBasePath = path.resolve(__dirname);

/* global process */

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE']
var browsers =
  (process.env.TEST_BROWSERS || 'ChromeHeadless').split(/\s*,\s*/g);

module.exports = function(karma) {
  karma.set({

    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    files: [
      'test/suite.js'
    ],

    preprocessors: {
      'test/suite.js': [ 'webpack', 'env' ]
    },

    reporters: [ 'spec' ],

    browsers: browsers,

    browserNoActivityTimeout: 30000,

    singleRun: true,
    autoWatch: false,


    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.css|\.dmn$/,
            use: 'raw-loader'
          }
        ]
      },
      resolve: {
        modules: [
          'node_modules',
          absoluteBasePath
        ]
      }
    }
  });
};
