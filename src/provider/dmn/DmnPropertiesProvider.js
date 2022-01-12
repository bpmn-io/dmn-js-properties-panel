import { Group } from '@bpmn-io/properties-panel';

import {
  IdProps,
  NameProps
} from './properties';

function GeneralGroup(element) {

  const entries = [
    ...NameProps({ element }),
    ...IdProps({ element })
  ];

  return {
    id: 'general',
    label: 'General',
    entries,
    component: Group
  };

}

function getGroups(element) {

  const groups = [
    GeneralGroup(element)
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

export default class DmnPropertiesProvider {

  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return (groups) => {
      groups = groups.concat(getGroups(element));
      return groups;
    };
  }

}

DmnPropertiesProvider.$inject = [ 'propertiesPanel' ];