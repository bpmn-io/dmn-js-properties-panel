import { Group } from '@bpmn-io/properties-panel';

import {
  DocumentationProps,
  IdProps,
  NameProps
} from './properties';
import { TypeRefProps } from './properties/TypeRefProps';
import { isAny } from 'dmn-js-shared/lib/util/ModelUtil';


export default class DmnPropertiesProvider {

  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return (groups) => {
      return [
        ...groups,
        ...getGroups(element)
      ];
    };
  }

}

DmnPropertiesProvider.$inject = [ 'propertiesPanel' ];


function getGroups(element) {

  const groups = [
    GeneralGroup(element),
    DocumentationGroup(element),
    ...(!isAny(element, [ 'dmn:Decision', 'dmn:InputData' ])
      ? []
      : [ VariableGroup(element) ])
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

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

function DocumentationGroup(element) {
  const entries = [
    ...DocumentationProps({ element })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'documentation',
    label: 'Documentation',
    entries,
    component: Group
  };
}

function VariableGroup(element) {

  const entries = [
    ...TypeRefProps({ element })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'variable',
    label: 'Variable',
    entries,
    component: Group
  };
}

