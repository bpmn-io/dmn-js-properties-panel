import { Group } from '@bpmn-io/properties-panel';

import { findIndex } from 'min-dash';

import {
  HistoryCleanupProps,
  VersionTagProps,
  IdProps
} from './properties';


const LOW_PRIORITY = 500;

const CAMUNDA_PLATFORM_GROUPS = [
  HistoryCleanupGroup,
];

/**
 * Provides `camunda` namespace properties.
 *
 * @example
 * ```javascript
 * import DmnModeler from 'dmn-js/lib/Modeler';
 * import {
 *   DmnPropertiesPanelModule,
 *   DmnPropertiesProviderModule,
 *   CamundaPlatformPropertiesProviderModule
 * } from 'dmn-js-properties-panel';
 *
 * const modeler = new DmnModeler({
 *   container: '#canvas',
 *   propertiesPanel: {
 *     parent: '#properties'
 *   },
 *   additionalModules: [
 *     DmnPropertiesPanelModule,
 *     DmnPropertiesProviderModule,
 *     CamundaPlatformPropertiesProviderModule
 *   ]
 * });
 * ```
 */
export default class CamundaPropertiesProvider {

  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);

    this._injector = injector;
  }

  getGroups(element) {
    return (groups) => {

      // (1) add Camunda Platform specific groups
      groups = groups.concat(this._getGroups(element));

      // (2) update existing groups with Camunda Platform specific properties
      updateGeneralGroup(groups, element);

      return groups;
    };
  }

  _getGroups(element) {
    const groups = CAMUNDA_PLATFORM_GROUPS.map(createGroup => createGroup(element, this._injector));

    // contract: if a group returns null, it should not be displayed at all
    return groups.filter(group => group !== null);
  }
}

CamundaPropertiesProvider.$inject = [ 'propertiesPanel', 'injector' ];

/**
 * This ensures the <Implementation> group always locates after <Documentation>
 */

function updateGeneralGroup(groups, element) {

  const generalGroup = findGroup(groups, 'general');

  if (!generalGroup) {
    return;
  }

  const { entries } = generalGroup;

  // (1) replace id with camunda id
  const idIndex = findIndex(entries, (entry) => entry.id === 'id');
  entries.splice(idIndex, 1, ...IdProps({ element }));

  // (2) add version tag after id
  entries.splice(idIndex + 1, 0, ...VersionTagProps({ element }));
}


function HistoryCleanupGroup(element) {
  const group = {
    label: 'History cleanup',
    id: 'Camunda__HistoryCleanup',
    component: Group,
    entries: [
      ...HistoryCleanupProps({ element })
    ]
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}



// helper /////////////////////

function findGroup(groups, id) {
  return groups.find(g => g.id === id);
}
