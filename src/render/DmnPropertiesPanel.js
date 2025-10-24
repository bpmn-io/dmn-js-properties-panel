import { PropertiesPanel } from '@bpmn-io/properties-panel';

import {
  DmnPropertiesPanelContext
} from '../context';

import { PanelHeaderProvider } from './PanelHeaderProvider';
import { PanelPlaceholderProvider } from './PanelPlaceholderProvider';

/**
   * @param {Object} props
   * @param {djs.model.Base|Array<djs.model.Base>} [props.element]
   * @param {Array} props.groups
   * @param {Injector} props.injector
   * @param {Object} props.layoutConfig
   * @param {Object} props.descriptionConfig
   * @param {Object} props.tooltipConfig
   */
export default function DmnPropertiesPanel(props) {
  const {
    element,
    groups,
    injector,
    layoutConfig,
    descriptionConfig,
    tooltipConfig
  } = props;

  const eventBus = injector.get('eventBus');

  const selectedElement = element;

  // (3) create properties panel context
  const dmnPropertiesPanelContext = {
    selectedElement,
    injector,
    getService(type, strict) { return injector.get(type, strict); }
  };

  // (5) notify layout changes
  const onLayoutChanged = (layout) => {
    eventBus.fire('propertiesPanel.layoutChanged', {
      layout
    });
  };

  // (6) notify description changes
  const onDescriptionLoaded = (description) => {
    eventBus.fire('propertiesPanel.descriptionLoaded', {
      description
    });
  };

  // (7) notify tooltip changes
  const onTooltipLoaded = (tooltip) => {
    eventBus.fire('propertiesPanel.tooltipLoaded', {
      tooltip
    });
  };

  return <DmnPropertiesPanelContext.Provider value={ dmnPropertiesPanelContext }>
    <PropertiesPanel
      element={ selectedElement }
      headerProvider={ PanelHeaderProvider }
      placeholderProvider={ PanelPlaceholderProvider }
      groups={ groups }
      layoutConfig={ layoutConfig }
      layoutChanged={ onLayoutChanged }
      descriptionConfig={ descriptionConfig }
      descriptionLoaded={ onDescriptionLoaded }
      tooltipConfig={ tooltipConfig }
      tooltipLoaded={ onTooltipLoaded }
      eventBus={ eventBus }
    />
  </DmnPropertiesPanelContext.Provider>;
}