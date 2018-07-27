'use strict';

import nameEntryFactory from './implementation/Name';

import { isAny } from 'dmn-js-shared/lib/util/ModelUtil';

export default function(group, element, translate) {

  if (isAny(element, [ 'dmn:DRGElement', 'dmn:Definitions' ])) {
    group.entries = group.entries.concat(nameEntryFactory(element, translate));
  }

}
