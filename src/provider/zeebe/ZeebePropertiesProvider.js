import { findIndex } from 'min-dash';

import {
  VersionTagProps
} from './properties';


const LOW_PRIORITY = 500;

/**
 * Provides `zeebe` namespace properties.
 *
 * @example
 * ```javascript
 * import DmnModeler from 'dmn-js/lib/Modeler';
 * import {
 *   DmnPropertiesPanelModule,
 *   DmnPropertiesProviderModule,
 *   ZeebePropertiesProviderModule
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
 *     ZeebePropertiesProviderModule
 *   ]
 * });
 * ```
 */
export default class ZeebePropertiesProvider {

  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);

    this._injector = injector;
  }

  getGroups(element) {
    return (groups) => {
      updateGeneralGroup(groups, element);

      return groups;
    };
  }
}

ZeebePropertiesProvider.$inject = [ 'propertiesPanel', 'injector' ];

function updateGeneralGroup(groups, element) {

  const generalGroup = findGroup(groups, 'general');

  if (!generalGroup) {
    return;
  }

  const { entries } = generalGroup;

  const idIndex = findIndex(entries, (entry) => entry.id === 'id');

  entries.splice(idIndex + 1, 0, ...VersionTagProps({ element }));
}

// helper /////////////////////

function findGroup(groups, id) {
  return groups.find(g => g.id === id);
}
