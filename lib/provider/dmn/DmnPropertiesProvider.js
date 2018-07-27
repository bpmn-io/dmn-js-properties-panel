'use strict';


import inherits from 'inherits';

import PropertiesActivator from '../../PropertiesActivator';

import idProps from './parts/IdProps';
import nameProps from './parts/NameProps';

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

export default DmnPropertiesProvider;