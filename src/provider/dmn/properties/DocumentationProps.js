import {
  TextAreaEntry,
  isTextAreaEntryEdited
} from '@bpmn-io/properties-panel';

import { getBusinessObject, is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  useService
} from '../../../hooks';


/**
 * @typedef { import('@bpmn-io/properties-panel').EntryDefinition } Entry
 */

/**
 * @returns {Array<Entry>} entries
 */
export function DocumentationProps(props) {
  const {
    element
  } = props;

  if (!is(element, 'dmn:DMNElement')) {
    return [];
  }

  const entries = [
    {
      id: 'description',
      component: Description,
      element,
      isEdited: isTextAreaEntryEdited
    }
  ];

  if (!is(element, 'dmn:Decision')) {
    return entries;
  }

  return entries.concat([
    {
      id: 'question',
      component: Question,
      element,
      isEdited: isTextAreaEntryEdited
    },
    {
      id: 'allowedAnswers',
      component: AllowedAnswers,
      element,
      isEdited: isTextAreaEntryEdited
    }
  ]);
}

function Description(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  let options = {
    element,
    id,
    label: translate('Description'),
    debounce,
    getValue: (element) => {
      return getBusinessObject(element).get('description');
    },
    setValue: (value) => {
      modeling.updateProperties(element, {
        description: value
      });
    }
  };

  return TextAreaEntry(options);
}

function Question(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  let options = {
    element,
    id,
    label: translate('Question'),
    debounce,
    getValue: (element) => {
      return getBusinessObject(element).get('question');
    },
    setValue: (value) => {
      modeling.updateProperties(element, {
        question: value
      });
    }
  };

  return TextAreaEntry(options);
}

function AllowedAnswers(props) {
  const {
    element,
    id
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  let options = {
    element,
    id,
    label: translate('Allowed answers'),
    debounce,
    getValue: (element) => {
      return getBusinessObject(element).get('allowedAnswers');
    },
    setValue: (value) => {
      modeling.updateProperties(element, {
        allowedAnswers: value
      });
    }
  };

  return TextAreaEntry(options);
}
