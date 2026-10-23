import {
  getBusinessObject,
  isAny
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

  if (!isAny(element, [ 'dmn:Decision', 'dmn:InputData' ])) {
    return [];
  }

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
      modeling.updateProperties(element, {
        variable: drdFactory.create('dmn:InformationItem', {
          name: businessObject.get('name') || '',
          typeRef: value }),
      });
      return;
    }

    modeling.updateModdleProperties(element, variable, {
      typeRef: value
    });
  };

  const getOptions = () => getTypeRefOptions(dataTypes.getAll());

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

// helpers //////////

/**
 * @typedef {{
 *   name: string,
 *   label: string,
 *   group?: { id: string, name: string }
 * }} DataType
 */

/**
 * Get select options for the given data types.
 *
 * Data types are grouped if there is more than one group, with
 * ungrouped data types coming first. Plain strings, as provided
 * by older versions of dmn-js, are supported, too.
 *
 * @param {Array<string|DataType>} dataTypes
 *
 * @return {Array<Object>} options
 */
function getTypeRefOptions(dataTypes) {
  const ungrouped = [];

  const groups = [];

  dataTypes.forEach(dataType => {
    const {
      name,
      label = name,
      group
    } = typeof dataType === 'string' ? { name: dataType } : dataType;

    const option = {
      value: name,
      label
    };

    if (!group) {
      return ungrouped.push(option);
    }

    let entry = groups.find(({ id }) => id === group.id);

    if (!entry) {
      entry = { id: group.id, name: group.name, options: [] };

      groups.push(entry);
    }

    entry.options.push(option);
  });

  if (groups.length + (ungrouped.length ? 1 : 0) < 2) {
    return [
      ...ungrouped,
      ...groups.flatMap(({ options }) => options)
    ];
  }

  return [
    ...ungrouped,
    ...groups.map(({ name, options }) => ({
      label: name,
      children: options
    }))
  ];
}
