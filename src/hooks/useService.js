import {
  useContext
} from '@bpmn-io/properties-panel/preact/hooks';

import { DmnPropertiesPanelContext } from '../context';


export default function(type, strict) {
  const {
    getService
  } = useContext(DmnPropertiesPanelContext);

  return getService(type, strict);
}