'use strict';

var entryFactory = require('../../../factory/EntryFactory');

var is = require('dmn-js-shared/lib/util/ModelUtil').is;

module.exports = function(group, element, translate) {

  if (is(element, 'dmn:Decision')) {
    var historyTimeToLiveEntry = entryFactory.textField({
      id: 'historyTimeToLive',
      label: translate('History Time To Live'),
      modelProperty: 'historyTimeToLive',
    });

    group.entries.push(historyTimeToLiveEntry);
  }

};
