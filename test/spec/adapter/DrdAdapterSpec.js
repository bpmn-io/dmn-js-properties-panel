'use strict';

import {
  bootstrapModeler,
  inject,
  openView
} from '../../helper';

/* global sinon */


import propertiesPanelModule from '../../../lib';
import propertiesProviderModule from '../properties';

import drdAdapterModule from '../../../lib/adapter/drd';

import diagramXML from './adapter.dmn';


describe('DrdAdapter', function() {

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  beforeEach(bootstrapModeler(diagramXML, {
    drd: {
      additionalModules: testModules.concat(drdAdapterModule)
    }
  }));

  beforeEach(function() {
    openView('definitions_dish');
  });


  describe('attach/detach', function() {

    it('should attach on modeler attach', inject(function(propertiesPanel) {

      // then
      expect(propertiesPanel._container.parentNode).to.exist;
    }));


    it('should detach on modeler detach', inject(function(drd, propertiesPanel) {

      // when
      drd.detach();

      // then
      expect(propertiesPanel._container.parentNode).not.to.exist;
    }));


    it('should detach on modeler destroy', inject(function(drd, propertiesPanel) {

      // when
      drd.destroy();

      // then
      expect(propertiesPanel._container.parentNode).not.to.exist;
    }));

  });


  describe('update', function() {

    it('should update on root added', inject(function(canvas, eventBus, propertiesPanel) {

      // given
      var spy = sinon.spy(propertiesPanel, 'update');

      var root = canvas.getRootElement();

      // when
      eventBus.fire('root.added', {
        element: root
      });

      // expect
      expect(spy).to.have.been.called;
    }));


    it('should not update on implicit root added', inject(function(eventBus, propertiesPanel) {

      // given
      var spy = sinon.spy(propertiesPanel, 'update');

      // when
      eventBus.fire('root.added', {
        element: {
          id: '__implicitroot'
        }
      });

      // expect
      expect(spy).to.not.have.been.called;
    }));


    it('should update on selection changed', inject(
      function(elementRegistry, eventBus, propertiesPanel, selection) {

        // given
        var spy = sinon.spy(propertiesPanel, 'update');

        var seasonDecision = elementRegistry.get('season');

        // when
        selection.select(seasonDecision);

        // then
        expect(spy).to.have.been.called;
      }
    ));


    it('should not update on selection changed if implicit root', inject(
      function(canvas, eventBus, propertiesPanel, selection) {

        // given
        var spy = sinon.spy(propertiesPanel, 'update');

        canvas.setRootElement({
          id: '__implicitroot',
          isImplicit: true
        }, true);

        // when
        selection.select(null);

        // then
        expect(spy).to.not.have.been.called;
      }
    ));


    it('should update on elements changed', inject(
      function(elementRegistry, eventBus, propertiesPanel) {

        // given
        var spy = sinon.spy(propertiesPanel, 'update');

        // when
        eventBus.fire('elements.changed', {
          elements: [
            elementRegistry.get('definitions_dish'),
            elementRegistry.get('season')
          ]
        });

        // then
        expect(spy).to.have.been.called;
      }
    ));


    it('should not update on elements changed if current element has not changed', inject(
      function(elementRegistry, eventBus, propertiesPanel) {

        // given
        var spy = sinon.spy(propertiesPanel, 'update');

        // when
        eventBus.fire('elements.changed', {
          elements: [
            elementRegistry.get('dish-decision'),
            elementRegistry.get('season')
          ]
        });

        // then
        expect(spy).to.not.have.been.called;
      }
    ));

  });

});
