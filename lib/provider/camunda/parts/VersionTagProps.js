'use strict';

var entryFactory = require('../../../factory/EntryFactory');

var is = require('dmn-js-shared/lib/util/ModelUtil').is;

module.exports = function(group, element, translate) {

  if (is(element, 'dmn:Decision')) {
    var versionTagEntry = entryFactory.textField({
      id: 'versionTag',
      label: translate('Version Tag'),
      modelProperty: 'versionTag'
    });

    group.entries.push(versionTagEntry);
  }

};
