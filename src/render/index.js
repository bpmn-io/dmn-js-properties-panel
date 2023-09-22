import DmnPropertiesPanelRenderer from './DmnPropertiesPanelRenderer';

import { DebounceInputModule, FeelPopupModule } from '@bpmn-io/properties-panel';

export default {
  __depends__: [
    DebounceInputModule,
    FeelPopupModule
  ],
  __init__: [
    'propertiesPanel'
  ],
  propertiesPanel: [ 'type', DmnPropertiesPanelRenderer ]
};