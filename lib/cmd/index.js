'use strict';

import forEach from 'lodash';

import UpdateBusinessObjectHandler from './UpdateBusinessObjectHandler';

var HANDLERS = {
  'properties-panel.update-businessobject': UpdateBusinessObjectHandler
};


function CommandInitializer(eventBus, commandStack) {

  eventBus.on('diagram.init', function() {
    forEach(HANDLERS, function(handler, id) {
      commandStack.registerHandler(id, handler);
    });
  });
}

CommandInitializer.$inject = [ 'eventBus', 'commandStack' ];

export default {
  __init__: [ CommandInitializer ]
};