import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import {
  useService
} from '../../../hooks';


export function VersionTagProps(props) {
  const {
    element
  } = props;

  if (!is(element, 'dmn:Decision')) {
    return [];
  }

  return [
    {
      id: 'versionTag',
      component: VersionTag,
      element,
      isEdited: isTextFieldEntryEdited
    },
  ];
}

function VersionTag(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return getBusinessObject(element).get('camunda:versionTag');
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:versionTag': value
    });
  };

  return TextFieldEntry({
    element,
    id,
    label: translate('Version tag'),
    getValue,
    setValue,
    debounce
  });
}
