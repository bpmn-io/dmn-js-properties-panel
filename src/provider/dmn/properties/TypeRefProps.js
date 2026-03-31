import {
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import {
  useService
} from '../../../hooks';

/**
 * @typedef { import('@bpmn-io/properties-panel').EntryDefinition } Entry
 */

/**
 * @returns {Array<Entry>} entries
 */
export function TypeRefProps(props) {
  const {
    element
  } = props;

  return [
    {
      id: 'typeRef',
      component: TypeRef,
      element,
      isEdited: isSelectEntryEdited
    }
  ];
}

function TypeRef(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');
  const dataTypes = useService('dataTypes');
  const drdFactory = useService('drdFactory');

  const businessObject = getBusinessObject(element);
  const variable = businessObject.get('variable');

  if (!variable) {
    modeling.updateProperties(element, { variable: drdFactory.create('dmn:InformationItem', { typeRef: 'Any' }) });
  }

  const currentType = businessObject.variable.typeRef ? businessObject.variable.typeRef || businessObject.typeRef : 'Any';

  const getValue = () => currentType;

  const setValue = (value) => {
    modeling.updateProperties(element, {
      variable: {
        ...businessObject.variable,
        typeRef: value
      }
    });
  };

  const getOptions = () => {
    const availableDataTypes = dataTypes.getAll();
    return availableDataTypes.map(type => ({
      value: type,
      label: type
    }));
  };

  return SelectEntry({
    element,
    id,
    label: translate('Type'),
    getValue,
    setValue,
    getOptions,
    debounce
  });
}