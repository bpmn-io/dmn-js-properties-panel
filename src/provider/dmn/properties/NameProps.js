import {
  TextFieldEntry,
  isTextFieldEntryEdited
} from '@bpmn-io/properties-panel';

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

  if (!isAny(element, [ 'dmn:DRGElement', 'dmn:Definitions', 'dmn:TextAnnotation' ])) {
    return [];
  }

  return [
    {
      id: 'name',
      component: <Name element={ element } />,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Name(props) {
  const {
    element
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  // (1) default: name
  let options = {
    element,
    id: 'name',
    label: translate('Name'),
    debounce,
    setValue: (value) => {
      modeling.updateProperties(element, {
        name: value
      });
    },
    getValue: (element) => {
      return element.businessObject.name;
    }
  };

  // (2) text annotation
  if (is(element, 'dmn:TextAnnotation')) {
    options = {
      ...options,
      setValue: (value) => {
        modeling.updateProperties(element, {
          text: value
        });
      },
      getValue: (element) => {
        return element.businessObject.text;
      }
    };
  }

  return TextFieldEntry(options);
}
