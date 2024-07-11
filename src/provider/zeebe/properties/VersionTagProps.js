import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import {
  useService
} from '../../../hooks';

import { createElement } from '../../utils/ElementUtil';

import { getExtensionElementsList } from '../../utils/ExtensionElementsUtil';


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
      isEdited: isTextFieldEntryEdited
    },
  ];
}

function VersionTag(props) {
  const { element } = props;

  const drdFactory = useService('drdFactory');
  const commandStack = useService('commandStack');
  const debounce = useService('debounceInput');
  const translate = useService('translate');

  const getValue = () => {
    const versionTag = getVersionTag(element);

    if (versionTag) {
      return versionTag.get('value');
    }
  };

  const setValue = (value) => {
    let commands = [];

    const businessObject = getBusinessObject(element);

    let extensionElements = businessObject.get('extensionElements');

    // (1) ensure extension elements
    if (!extensionElements) {
      extensionElements = createElement(
        'dmn:ExtensionElements',
        { values: [] },
        businessObject,
        drdFactory
      );

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: { extensionElements }
        }
      });
    }

    // (2) ensure version tag
    let versionTag = getVersionTag(element);

    if (!versionTag) {
      versionTag = createElement(
        'zeebe:VersionTag',
        {},
        extensionElements,
        drdFactory
      );

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [ ...extensionElements.get('values'), versionTag ]
          }
        }
      });
    }

    // (3) update version tag value
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: versionTag,
        properties: { value }
      }
    });

    commandStack.execute('properties-panel.multi-command-executor', commands);
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


// helper //////////////////

function getVersionTag(element) {
  const businessObject = getBusinessObject(element);

  return getExtensionElementsList(businessObject, 'zeebe:VersionTag')[ 0 ];
}