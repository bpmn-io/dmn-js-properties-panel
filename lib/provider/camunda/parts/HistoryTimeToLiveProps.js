'use strict';

import entryFactory from '../../../factory/EntryFactory';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default function(group, element, translate) {

  if (is(element, 'dmn:Decision')) {
    var historyTimeToLiveEntry = entryFactory.textField({
      id: 'historyTimeToLive',
      label: translate('History Time To Live'),
      modelProperty: 'historyTimeToLive',
    });

    group.entries.push(historyTimeToLiveEntry);
  }

}
