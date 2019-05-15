'use strict';

import entryFactory from '../../../factory/EntryFactory';
import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';
import { isIdValid } from '../../../Utils';
import cmdHelper from '../../../helper/CmdHelper';

import { isAny } from 'dmn-js-shared/lib/util/ModelUtil';

export default function(group, element, translate, options) {

  if (!isAny(element, [ 'dmn:DRGElement', 'dmn:Definitions' ])) {
    return;
  }

  var description = options && options.description;

  // Id
  group.entries.push(entryFactory.validationAwareTextField({
    id: 'id',
    label: translate('Id'),
    description: description && translate(description),
    modelProperty: 'id',
    getProperty: function(element) {
      return getBusinessObject(element).id;
    },
    setProperty: function(element, properties) {
      return cmdHelper.updateProperties(element, properties);
    },
    validate: function(element, values) {
      var idValue = values.id;

      var bo = getBusinessObject(element);

      var idError = isIdValid(bo, idValue, translate);

      return idError ? { id: idError } : {};
    }
  }));

}
