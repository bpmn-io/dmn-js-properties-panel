'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

// bpmn properties
var idProps = require('../dmn/parts/IdProps'),
    nameProps = require('../dmn/parts/NameProps');

// camunda properties
var versionTag = require('./parts/VersionTagProps');

// history time to live
var historyTimeToLive = require('./parts/HistoryTimeToLiveProps');

// helpers ////////////////////////////////////////

function createGeneralTabGroups(element, translate) {

  // refer to target element for external labels
  element = element.labelTarget || element;

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  versionTag(generalGroup, element, translate);

  var historyTimeToLiveGroup = {
    id: 'historyConfiguration',
    label: translate('History Configuration'),
    entries: []
  };
  historyTimeToLive(historyTimeToLiveGroup, element, translate);

  var groups = [];
  groups.push(generalGroup);
  groups.push(historyTimeToLiveGroup);

  return groups;
}

// Camunda Properties Provider /////////////////////////////////////


/**
 * A properties provider for Camunda related properties.
 *
 * @param {EventBus} eventBus
 * @param {Function} translate
 */
function CamundaPropertiesProvider(eventBus, translate) {

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

CamundaPropertiesProvider.$inject = [
  'eventBus',
  'translate'
];

inherits(CamundaPropertiesProvider, PropertiesActivator);

module.exports = CamundaPropertiesProvider;
