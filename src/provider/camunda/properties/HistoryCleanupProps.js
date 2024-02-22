import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import {
  useService
} from '../../../hooks';


export function HistoryCleanupProps(props) {
  const {
    element
  } = props;

  if (!is(element, 'dmn:Decision')) {
    return [];
  }
  return [
    {
      id: 'historyTimeToLive',
      component: HistoryTimeToLive,
      element,
      isEdited: isTextFieldEntryEdited
    },
  ];
}

function HistoryTimeToLive(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return getBusinessObject(element).get('camunda:historyTimeToLive');
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:historyTimeToLive': value
    });
  };

  return TextFieldEntry({
    element,
    id,
    label: translate('Time to live'),
    tooltip: <div>
      <p>
        { translate('Number of days before this resource is being cleaned up. If specified, takes precedence over the engine configuration.') }{' '}
        <a href="https://docs.camunda.org/manual/7.20/update/minor/719-to-720/#enforce-history-time-to-live" target="_blank" rel="noopener">{ translate('Learn more') }</a>
      </p>
    </div>,
    getValue,
    setValue,
    debounce
  });
}
