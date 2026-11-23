import DmnPropertiesPanel from './DmnPropertiesPanel';

import {
  isUndo,
  isRedo
} from 'diagram-js/lib/features/keyboard/KeyboardUtil';

import {
  Component,
  render
} from '@bpmn-io/properties-panel/preact';

import {
  domify,
  query as domQuery,
  event as domEvent
} from 'min-dom';

import { find } from 'min-dash';

{ /* Required to break up imports, see https://github.com/babel/babel/issues/15156 */ }

const DEFAULT_PRIORITY = 1000;

/**
 * @typedef { import('@bpmn-io/properties-panel').GroupDefinition } GroupDefinition
 * @typedef { import('@bpmn-io/properties-panel').ListGroupDefinition } ListGroupDefinition
 * @typedef { { getGroups: (ModdleElement) => (Array{GroupDefinition|ListGroupDefinition}) => Array{GroupDefinition|ListGroupDefinition}) } PropertiesProvider
 */

export default class DmnPropertiesPanelRenderer {

  constructor(config, injector, eventBus, dmnjs) {
    const {
      parent,
      layout: layoutConfig,
      description: descriptionConfig,
      tooltip: tooltipConfig
    } = config || {};

    this._eventBus = eventBus;
    this._injector = injector;
    this._layoutConfig = layoutConfig;
    this._descriptionConfig = descriptionConfig;
    this._tooltipConfig = tooltipConfig;

    this._container = domify(
      '<div style="height: 100%" tabindex="-1" class="bio-properties-panel-container"></div>'
    );

    this._element = null;

    this._listeners = [];

    this._root = null;

    this._setRoot = (root) => {
      this._root = root;
    };

    this._getPanelProps = this._getPanelProps.bind(this);

    var commandStack = injector.get('commandStack', false);

    commandStack && setupKeyboard(this._container, eventBus, commandStack);

    eventBus.on('diagram.destroy', () => {
      this.detach();
    });

    this._on('import.done', () => {
      if (parent) {
        this.attachTo(parent);
      }

      const rootElement = this._injector.get('canvas').getRootElement();

      // a failed import leaves no root; do not select the implicit one
      if (isImplicitRoot(rootElement)) {
        return;
      }

      this._render(rootElement);

      // notify interested parties on property panel updates
      this._eventBus.fire('propertiesPanel.updated', {
        element: rootElement
      });
    });

    this._on('selection.changed', (event) => {
      const { newSelection = [] } = event;

      if (newSelection.length > 1) {
        return this._update(newSelection);
      }

      const newElement = newSelection[0];

      const rootElement = this._injector.get('canvas').getRootElement();

      if (isImplicitRoot(rootElement)) {
        return;
      }

      this._update(newElement || rootElement);
    });

    this._on('elements.changed', (event) => {
      const { elements } = event;

      const elementRegistry = this._injector.get('elementRegistry');

      const updatedElement = find(elements, (element) => element === this._element);

      if (updatedElement && elementRegistry.get(updatedElement.id)) {
        this._update(updatedElement);
      }
    });

    this._on('propertiesPanel.providersChanged', () => {
      this._update(this._element);
    });

    eventBus.on('detach', (event) => {
      this.detach();
    });

    dmnjs.on('detach', () => {
      this.detach();
    });
  }


  /**
   * Attach the properties panel to a parent node.
   *
   * @param {HTMLElement} container
   */
  attachTo(container) {
    if (!container) {
      throw new Error('container required');
    }

    // unwrap jQuery if provided
    if (container.get && container.constructor.prototype.jquery) {
      container = container.get(0);
    }

    if (typeof container === 'string') {
      container = domQuery(container);
    }

    // (1) detach from old parent
    this.detach();

    // (2) append to parent container
    container.appendChild(this._container);

    // (3) notify interested parties
    this._eventBus.fire('propertiesPanel.attach');
  }

  /**
   * Detach the properties panel from its parent node.
   */
  detach() {
    const parentNode = this._container.parentNode;

    if (parentNode) {
      parentNode.removeChild(this._container);

      this._eventBus.fire('propertiesPanel.detach');
    }
  }

  /**
   * Register a new properties provider to the properties panel.
   *
   * @param {Number} [priority]
   * @param {PropertiesProvider} provider
   */
  registerProvider(priority, provider) {

    if (!provider) {
      provider = priority;
      priority = DEFAULT_PRIORITY;
    }

    if (typeof provider.getGroups !== 'function') {
      console.error(
        'Properties provider does not implement #getGroups(element) API'
      );

      return;
    }

    this._eventBus.on('propertiesPanel.getProviders', priority, function(event) {
      event.providers.push(provider);
    });

    this._eventBus.fire('propertiesPanel.providersChanged');
  }

  _getProviders() {
    const event = this._eventBus.createEvent({
      type: 'propertiesPanel.getProviders',
      providers: []
    });

    this._eventBus.fire(event);

    return event.providers;
  }

  _render(element = this._element) {
    const canvas = this._injector.get('canvas');

    if (!element) {
      element = canvas.getRootElement();
    }

    if (isImplicitRoot(element)) {
      return;
    }

    this._element = element;

    render(
      <DmnPropertiesPanelRoot
        ref={ this._setRoot }
        getProps={ this._getPanelProps } />,
      this._container
    );

    this._eventBus.fire('propertiesPanel.rendered');
  }

  _update(element) {

    if (!element) {
      return;
    }

    // handle labels
    if (element.type === 'label') {
      element = element.labelTarget;
    }

    this._element = element;

    this._scheduleRender();

    // notify interested parties on property panel updates
    this._eventBus.fire('propertiesPanel.updated', {
      element
    });
  }

  _scheduleRender() {
    if (this._root) {
      this._root.forceUpdate();
    }
  }

  _getPanelProps() {
    return {
      element: this._element,
      injector: this._injector,
      getProviders: this._getProviders.bind(this),
      layoutConfig: this._layoutConfig,
      descriptionConfig: this._descriptionConfig,
      tooltipConfig: this._tooltipConfig
    };
  }

  _on(events, callback) {
    this._eventBus.on(events, callback);

    this._listeners.push({ events, callback });
  }

  _destroy() {
    this._listeners.forEach(({ events, callback }) => {
      this._eventBus.off(events, callback);
    });

    this._listeners = [];

    this._element = null;

    if (this._container) {
      render(null, this._container);

      this._eventBus.fire('propertiesPanel.destroyed');
    }
  }
}

DmnPropertiesPanelRenderer.$inject = [ 'config.propertiesPanel', 'injector', 'eventBus', '_parent' ];


class DmnPropertiesPanelRoot extends Component {
  render() {
    const { getProps } = this.props;

    return <DmnPropertiesPanel { ...getProps() } />;
  }
}


// helpers ///////////////////////

function isImplicitRoot(element) {
  return element && element.isImplicit;
}


/**
 * Setup keyboard bindings (undo, redo) on the given container.
 *
 * @param {Element} container
 * @param {EventBus} eventBus
 * @param {CommandStack} commandStack
 */
function setupKeyboard(container, eventBus, commandStack) {

  function cancel(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleKeys(event) {

    if (isUndo(event)) {
      commandStack.undo();

      return cancel(event);
    }

    if (isRedo(event)) {
      commandStack.redo();

      return cancel(event);
    }
  }

  eventBus.on('keyboard.bind', function() {
    domEvent.bind(container, 'keydown', handleKeys);
  });

  eventBus.on('keyboard.unbind', function() {
    domEvent.unbind(container, 'keydown', handleKeys);
  });
}