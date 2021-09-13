function DrdAdapter(
    canvas,
    config,
    eventBus,
    propertiesPanel
) {

  eventBus.on('root.added', function(e) {
    var element = e.element;

    if (isImplicitRoot(element)) {
      return;
    }

    propertiesPanel.update(element);
  });

  eventBus.on('selection.changed', function(e) {
    var newElement = e.newSelection[0];

    var rootElement = canvas.getRootElement();

    if (!newElement) {
      newElement = canvas.getRootElement();
    }

    if (isImplicitRoot(rootElement)) {
      return;
    }

    propertiesPanel.update(newElement);
  });

  eventBus.on('elements.changed', function(e) {
    var element = propertiesPanel.getCurrentElement();

    if (element) {
      if (e.elements.indexOf(element) !== -1) {
        propertiesPanel.update(element);
      }
    }
  });

  eventBus.on('diagram.destroy', function() {
    propertiesPanel.detach();
  });

  eventBus.on('attach', function() {

    if (config.propertiesPanel && config.propertiesPanel.parent) {
      propertiesPanel.attachTo(config.propertiesPanel.parent);
    }
  });

  eventBus.on('detach', function() {
    propertiesPanel.detach();
  });
}

DrdAdapter.$inject = [
  'canvas',
  'config',
  'eventBus',
  'propertiesPanel'
];

export default DrdAdapter;

// helpers //////////

function isImplicitRoot(element) {
  return element && (element.isImplicit || element.id === '__implicitroot');
}