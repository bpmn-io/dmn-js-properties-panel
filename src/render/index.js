import {
  DebounceInputModule,
  FeelPopupModule
} from '@bpmn-io/properties-panel';

import DmnPropertiesPanelRenderer from './DmnPropertiesPanelRenderer';

import Commands from '../cmd';

export default {
  __depends__: [
    Commands,
    DebounceInputModule,
    FeelPopupModule
  ],
  __init__: [
    'propertiesPanel'
  ],
  propertiesPanel: [ 'type', DmnPropertiesPanelRenderer ]
};