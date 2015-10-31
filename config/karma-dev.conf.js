'use strict';

const _ = require('lodash');
const commonConf = require('./karma.conf');

const conf = {
  files: [
    './test/lib/**/*',
    './dist/**/*',
    './tests/**/*.js'
  ],
  preprocessors: {
    './dist/ng-selecta.js': [
      'coverage'
    ]
  },
  reporters: [
    'spec',
    'coverage'
  ],
  coverageReporter: {
    type: 'html',
    dir: 'coverage/'
  }
};

module.exports = _.assign({}, commonConf, conf);