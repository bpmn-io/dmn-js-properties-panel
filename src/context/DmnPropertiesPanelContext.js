import {
  createContext
} from '@bpmn-io/properties-panel/preact';

const DmnPropertiesPanelContext = createContext({
  selectedElement: null,
  injector: null,
  getService: () => null
});

export default DmnPropertiesPanelContext;