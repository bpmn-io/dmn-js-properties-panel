import {
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

import { SelectEntry } from '@bpmn-io/properties-panel';

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
      isEdited: node => node.value !== 'Any'
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

  const getValue = () => {
    const variable = businessObject.get('variable');
    return variable?.get('typeRef') || 'Any';
  };

  const setValue = (value) => {
    const variable = businessObject.get('variable');
    if (!variable) {
      modeling.updateProperties(element, { variable: drdFactory.create('dmn:InformationItem', { typeRef: value }) });
      return;
    }

    modeling.updateModdleProperties(element, variable, {
      typeRef: value
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