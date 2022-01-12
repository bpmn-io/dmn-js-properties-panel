import DmnPropertiesPanelRenderer from './DmnPropertiesPanelRenderer';

import { DebounceInputModule } from '@bpmn-io/properties-panel';

export default {
  __depends__: [
    DebounceInputModule
  ],
  __init__: [
    'propertiesPanel'
  ],
  propertiesPanel: [ 'type', DmnPropertiesPanelRenderer ]
};