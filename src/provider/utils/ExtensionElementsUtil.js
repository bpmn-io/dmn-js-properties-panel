import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { createElement } from './ElementUtil';

import { isArray } from 'min-dash';

/**
 * Get extension elements of business object. Optionally filter by type.
 */
export function getExtensionElementsList(businessObject, type = undefined) {
  const extensionElements = businessObject.get('extensionElements');

  if (!extensionElements) {
    return [];
  }

  const values = extensionElements.get('values');

  if (!values || !values.length) {
    return [];
  }

  if (type) {
    return values.filter(value => is(value, type));
  }

  return values;
}

/**
 * Add one or more extension elements. Create dmn:ExtensionElements if it doesn't exist.
 */
export function addExtensionElements(element, businessObject, extensionElementToAdd, dmnFactory, commandStack) {
  const commands = [];

  let extensionElements = businessObject.get('extensionElements');

  // (1) create dmn:ExtensionElements if it doesn't exist
  if (!extensionElements) {
    extensionElements = createElement(
      'dmn:ExtensionElements',
      {
        values: []
      },
      businessObject,
      dmnFactory
    );

    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: businessObject,
        properties: {
          extensionElements
        }
      }
    });
  }

  extensionElementToAdd.$parent = extensionElements;

  // (2) add extension element to list
  commands.push({
    cmd: 'element.updateModdleProperties',
    context: {
      element,
      moddleElement: extensionElements,
      properties: {
        values: [ ...extensionElements.get('values'), extensionElementToAdd ]
      }
    }
  });

  commandStack.execute('properties-panel.multi-command-executor', commands);
}

/**
 * Remove one or more extension elements. Remove dmn:ExtensionElements afterwards if it's empty.
 */
export function removeExtensionElements(element, businessObject, extensionElementsToRemove, commandStack) {
  if (!isArray(extensionElementsToRemove)) {
    extensionElementsToRemove = [ extensionElementsToRemove ];
  }

  const extensionElements = businessObject.get('extensionElements'),
        values = extensionElements.get('values').filter(value => !extensionElementsToRemove.includes(value));

  commandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: extensionElements,
    properties: {
      values
    }
  });
}
