'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var idProps = require('./parts/IdProps'),
    nameProps = require('./parts/NameProps');

function createGeneralTabGroups(element, translate) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);

  return [
    generalGroup
  ];

}

function DmnPropertiesProvider(eventBus, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(element, translate)
    };

    return [
      generalTab
    ];
  };
}

DmnPropertiesProvider.$inject = [ 'eventBus', 'translate' ];

inherits(DmnPropertiesProvider, PropertiesActivator);

module.exports = DmnPropertiesProvider;