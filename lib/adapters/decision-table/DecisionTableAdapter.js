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

  // account for the inconsitsent naming of the same command
  commandStack.registerHandler('element.updateProperties', function() {
    this.postExecute = function(context) {
      commandStack.execute('updateProperties', context);
    };
  });
}

DecisionTableAdapter.$inject = [
  'commandStack',
  'config',
  'eventBus',
  'propertiesPanel',
  'sheet'
];

module.exports = DecisionTableAdapter;

// helpers //////////

function isImplicitRoot(element) {
  return element.id === '__implicitroot';
}