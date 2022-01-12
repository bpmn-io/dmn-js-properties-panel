import {
  createContext
} from '@bpmn-io/properties-panel/preact';

const DmnPropertiesPanelContext = createContext({
  selectedElement: null,
  injector: null,
  getService() { return null;}
});

export default DmnPropertiesPanelContext;