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
      component: <VersionTag element={ element } />,
      isEdited: isTextFieldEntryEdited
    },
  ];
}

function VersionTag(props) {
  const { element } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.versionTag;
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:versionTag': value
    });
  };

  return TextFieldEntry({
    element,
    id: 'versionTag',
    label: translate('Version tag'),
    getValue,
    setValue,
    debounce
  });
}
