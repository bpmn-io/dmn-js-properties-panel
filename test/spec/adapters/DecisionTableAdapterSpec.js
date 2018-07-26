'use strict';

var helper = require('../../helper'),
    bootstrapModeler = helper.bootstrapModeler,
    inject = helper.inject,
    openView = helper.openView;


/* global sinon */


var propertiesPanelModule = require('../../../lib'),
    propertiesProviderModule = require('../properties');

var decisionTableAdapterModule = require('../../../lib/adapters/decision-table');


describe('DecisionTableAdapter', function() {

  var diagramXML = require('./adapters.dmn');

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  beforeEach(bootstrapModeler(diagramXML, {
    decisionTable: {
      additionalModules: testModules.concat(decisionTableAdapterModule)
    }
  }));

  beforeEach(function() {
    openView('season');
  });


  describe('attach/detach', function() {

    it('should attach on editor attach', inject(function(propertiesPanel) {

      // then
      expect(propertiesPanel._container.parentNode).to.exist;
    }));


    it('should detach on editor detach', inject(function(decisionTable, propertiesPanel) {

      // when
      decisionTable.detach();

      // then
      expect(propertiesPanel._container.parentNode).not.to.exist;
    }));


    it('should detach on editor destroy', inject(function(decisionTable, propertiesPanel) {

      // when
      decisionTable.destroy();

      // then
      expect(propertiesPanel._container.parentNode).not.to.exist;
    }));

  });


  describe('update', function() {

    it('should update on root added', inject(function(sheet, eventBus, propertiesPanel) {

      // given
      var spy = sinon.spy(propertiesPanel, 'update');

      var root = sheet.getRoot();

      // when
      eventBus.fire('root.added', {
        root: root
      });

      // expect
      expect(spy).to.have.been.called;
    }));


    it('should not update on implicit root added', inject(function(eventBus, propertiesPanel) {

      // given
      var spy = sinon.spy(propertiesPanel, 'update');

      // when
      eventBus.fire('root.added', {
        root: {
          id: '__implicitroot'
        }
      });

      // expect
      expect(spy).to.not.have.been.called;
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
