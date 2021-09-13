function DecisionTableAdapter(
    commandStack,
    config,
    eventBus,
    propertiesPanel,
    sheet
) {

  eventBus.on('root.added', function(e) {
    var root = e.root;

    if (isImplicitRoot(root)) {
      return;
    }

    propertiesPanel.update(root);
  });

  eventBus.on('elements.changed', function(e) {
    propertiesPanel.update(sheet.getRoot().businessObject.$parent);
  });

  eventBus.on('table.destroy', function() {
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

DecisionTableAdapter.$inject = [
  'commandStack',
  'config',
  'eventBus',
  'propertiesPanel',
  'sheet'
];

export default DecisionTableAdapter;

// helpers //////////

function isImplicitRoot(element) {
  return element && (element.isImplicit || element.id === '__implicitroot');
}