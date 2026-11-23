import {
  useMemo
} from '@bpmn-io/properties-panel/preact/hooks';

import {
  isArray,
  reduce
} from 'min-dash';

import { PropertiesPanel } from '@bpmn-io/properties-panel';

import {
  DmnPropertiesPanelContext
} from '../context';

import { PanelHeaderProvider } from './PanelHeaderProvider';
import { PanelPlaceholderProvider } from './PanelPlaceholderProvider';

{ /* Required to break up imports, see https://github.com/babel/babel/issues/15156 */ }

/**
   * @param {Object} props
   * @param {djs.model.Base|Array<djs.model.Base>} [props.element]
   * @param {Injector} props.injector
   * @param { (djs.model.Base) => Array<PropertiesProvider> } props.getProviders
   * @param {Object} props.layoutConfig
   * @param {Object} props.descriptionConfig
   * @param {Object} props.tooltipConfig
   */
export default function DmnPropertiesPanel(props) {
  const {
    element: selectedElement,
    injector,
    getProviders,
    layoutConfig,
    descriptionConfig,
    tooltipConfig
  } = props;

  const eventBus = injector.get('eventBus');

  // (3) create properties panel context
  const dmnPropertiesPanelContext = {
    selectedElement,
    injector,
    getService(type, strict) { return injector.get(type, strict); }
  };

  // (4) retrieve groups for selected element
  const providers = getProviders(selectedElement);

  const groups = useMemo(() => {
    return reduce(providers, function(groups, provider) {

      // do not collect groups for multi element state
      if (isArray(selectedElement)) {
        return [];
      }
      const updater = provider.getGroups(selectedElement);

      return updater(groups);
    }, []);
  }, [ providers, selectedElement ]);

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

