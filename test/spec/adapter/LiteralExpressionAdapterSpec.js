'use strict';

var helper = require('../../helper'),
    bootstrapModeler = helper.bootstrapModeler,
    inject = helper.inject,
    openView = helper.openView;


/* global sinon */


var propertiesPanelModule = require('../../../lib'),
    propertiesProviderModule = require('../properties');

var literalExpressionAdapterModule = require('../../../lib/adapter/literal-expression');


describe('LiteralExpressionAdapter', function() {

  var diagramXML = require('./adapter.dmn');

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  beforeEach(bootstrapModeler(diagramXML, {
    literalExpression: {
      additionalModules: testModules.concat(literalExpressionAdapterModule)
    }
  }));

  beforeEach(function() {
    openView('literal-expression');
  });


  describe('attach/detach', function() {

    it('should attach on editor attach', inject(function(propertiesPanel) {

      // then
      expect(propertiesPanel._container.parentNode).to.exist;
    }));


    it('should detach on editor detach', inject(function(viewer, propertiesPanel) {

      // when
      viewer.detach();

      // then
      expect(propertiesPanel._container.parentNode).not.to.exist;
    }));


    it('should detach on editor destroy', inject(function(viewer, propertiesPanel) {

      // when
      viewer.destroy();

      // then
      expect(propertiesPanel._container.parentNode).not.to.exist;
    }));

  });


  describe('update', function() {

    it('should update on import', inject(function(eventBus, propertiesPanel) {

      // given
      var spy = sinon.spy(propertiesPanel, 'update');

      // when
      eventBus.fire('import');

      // expect
      expect(spy).to.have.been.called;
    }));


    it('should update on elements changed', inject(function(eventBus, propertiesPanel) {

      // given
      var spy = sinon.spy(propertiesPanel, 'update');

      // when
      eventBus.fire('elements.changed', {
        elements: []
      });

      // then
      expect(spy).to.have.been.called;
    }));

  });

});
