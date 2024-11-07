import { TextAreaEntry, isTextAreaEntryEdited } from '@bpmn-io/properties-panel';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  useService
} from '../../../hooks';

import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * @typedef { import('@bpmn-io/properties-panel').EntryDefinition } Entry
 */

/**
 * @returns {Array<Entry>} entries
 */
export function NameProps(props) {
  const {
    element
  } = props;

  if (!isAny(element, [ 'dmn:DRGElement', 'dmn:Definitions', 'dmn:TextAnnotation', 'dmn:LiteralExpression' ])) {
    return [];
  }

  return [
    {
      id: 'name',
      component: Name,
      element,
      isEdited: isTextAreaEntryEdited
    }
  ];
}

function Name(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  // (1) default: name or text
  let propertyName = 'name';
  let options = {
    element,
    id,
    label: translate('Name'),
    debounce,
    getValue: (element) => {
      return getBusinessObject(element).get(propertyName);
    },
    setValue: (value) => {
      const properties = {};
      properties[propertyName] = value;
      modeling.updateProperties(element, properties);
    },
      return getBusinessObject(element).get('name');
    },
    setValue: (value) => {
      modeling.updateProperties(element, {
        name: value
      });
    },
    autoResize: true
  };

  // (2) text annotation or literal expression
  if (is(element, 'dmn:TextAnnotation') || is(element, 'dmn:LiteralExpression')) {
    propertyName = 'text';
  if (is(element, 'dmn:TextAnnotation')) {
      ...options,
      getValue: (element) => {
        return getBusinessObject(element).get('text');
      },
      setValue: (value) => {
        modeling.updateProperties(element, {
          text: value
        });
      }
    };
  }

  return TextAreaEntry(options);
}
