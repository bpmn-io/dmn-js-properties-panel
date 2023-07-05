import {
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
      component: Id,
      element,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Id(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  const getValue = (element) => {
    return getBusinessObject(element).get('id');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    modeling.updateProperties(element, {
      id: value
    });
  };

  const validate = (value) => {
    const businessObject = getBusinessObject(element);

    return isIdValid(businessObject, value, translate);
  };

  return TextFieldEntry({
    element,
    id,
    label: translate('ID'),
    getValue,
    setValue,
    debounce,
    validate
  });
}