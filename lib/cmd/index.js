'use strict';

var forEach = require('lodash/forEach');

var HANDLERS = {
  'properties-panel.update-businessobject': require('./UpdateBusinessObjectHandler')
};


function CommandInitializer(eventBus, commandStack) {

  eventBus.on('diagram.init', function() {
    forEach(HANDLERS, function(handler, id) {
      commandStack.registerHandler(id, handler);
    });
  });
}

CommandInitializer.$inject = [ 'eventBus', 'commandStack' ];

module.exports = {
  __init__: [ CommandInitializer ]
};