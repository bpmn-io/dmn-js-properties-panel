'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    getBusinessObject = require('dmn-js-shared/lib/util/ModelUtil').getBusinessObject,
    utils = require('../../../Utils'),
    cmdHelper = require('../../../helper/CmdHelper');

var isAny = require('dmn-js-shared/lib/util/ModelUtil').isAny;

module.exports = function(group, element, translate, options) {

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

      var idError = utils.isIdValid(bo, idValue);

      return idError ? { id: idError } : {};
    }
  }));

};
