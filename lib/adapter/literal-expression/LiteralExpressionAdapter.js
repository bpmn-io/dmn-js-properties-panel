function LiteralExpressionAdapter(
    commandStack,
    config,
    eventBus,
    propertiesPanel,
    viewer
) {

  eventBus.on('import', function() {
    propertiesPanel.update(viewer._decision);
  });

  eventBus.on('elements.changed', function(e) {
    propertiesPanel.update(viewer._decision);
  });

  eventBus.on('viewer.destroy', function() {
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

LiteralExpressionAdapter.$inject = [
  'commandStack',
  'config',
  'eventBus',
  'propertiesPanel',
  'viewer'
];

export default LiteralExpressionAdapter;