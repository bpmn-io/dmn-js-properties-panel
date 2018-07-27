'use strict';

import entryFactory from '../../../factory/EntryFactory';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default function(group, element, translate) {

  if (is(element, 'dmn:Decision')) {
    var versionTagEntry = entryFactory.textField({
      id: 'versionTag',
      label: translate('Version Tag'),
      modelProperty: 'versionTag'
    });

    group.entries.push(versionTagEntry);
  }

}
