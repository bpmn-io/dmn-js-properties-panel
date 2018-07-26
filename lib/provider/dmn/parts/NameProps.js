'use strict';

var nameEntryFactory = require('./implementation/Name');

var isAny = require('dmn-js-shared/lib/util/ModelUtil').isAny;

module.exports = function(group, element, translate) {

  if (isAny(element, [ 'dmn:DRGElement', 'dmn:Definitions' ])) {
    group.entries = group.entries.concat(nameEntryFactory(element, translate));
  }

};
