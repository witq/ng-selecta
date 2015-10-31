'use strict';

const _ = require('lodash');
const commonConf = require('./karma.conf');

const conf = {
  files: [
    './test/lib/**/*',
    './dist/**/*',
    './tests/**/*.js'
  ],
  reporters: [
    'spec'
  ]
};

module.exports = _.assign({}, commonConf, conf);