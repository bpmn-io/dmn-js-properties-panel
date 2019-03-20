'use strict';

import inherits from 'inherits';

import PropertiesActivator from '../../PropertiesActivator';

// bpmn properties
import idProps from '../dmn/parts/IdProps';
import nameProps from '../dmn/parts/NameProps';

// camunda properties
import versionTag from './parts/VersionTagProps';

// history time to live
import historyTimeToLive from './parts/HistoryTimeToLiveProps';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

// helpers ////////////////////////////////////////

var DECISION_KEY_HINT = 'This maps to the decision definition key.';

function createGeneralTabGroups(element, translate) {

  // refer to target element for external labels
  element = element.labelTarget || element;

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  var idOptions;
  if (is(element, 'dmn:Decision')) {
    idOptions = { description: DECISION_KEY_HINT };
  }
  idProps(generalGroup, element, translate, idOptions);
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

export default CamundaPropertiesProvider;
