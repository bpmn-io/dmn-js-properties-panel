import {
  is,
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import {
  useService
} from '../../../hooks';

import {
  isIdValid
} from '../../utils/ValidationUtil';


/**
 * @typedef { import('@bpmn-io/properties-panel').EntryDefinition } Entry
 */

/**
 * @returns {Array<Entry>} entries
 */
export function IdProps(props) {
  const {
    element
  } = props;

  return [
    {
      id: 'id',
      component: <Id element={ element } />,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Id(props) {
  const {
    element
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  const setValue = (value) => {
    modeling.updateProperties(element, {
      id: value
    });
  };

  const getValue = (element) => {
    return element.businessObject.id;
  };

  const validate = (value) => {
    const businessObject = getBusinessObject(element);

    return isIdValid(businessObject, value, translate);
  };

  const description = is(element, 'dmn:Decision') ?
    translate('This maps to the decision definition key.')
    : null;

  return TextFieldEntry({
    element,
    id: 'id',
    label: translate('ID'),
    getValue,
    setValue,
    debounce,
    validate,
    description
  });
}