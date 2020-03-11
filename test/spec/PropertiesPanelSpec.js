'use strict';

import TestContainer from 'mocha-test-container-support';

import {
  bootstrapModeler,
  inject,
  openView
} from '../helper';

import propertiesPanelModule from '../../lib';
import propertiesProviderModule from './properties';

import drdAdapterModule from '../../lib/adapter/drd';
import literalExpressionAdapter from '../../lib/adapter/literal-expression';

import decisionTableAdapter from '../../lib/adapter/decision-table';

import {
  query as domQuery,
  attr as domAttr
} from 'min-dom';

import diagramXML from './test.dmn';


describe('PropertiesPanel', function() {

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    drd: {
      additionalModules: testModules.concat(drdAdapterModule)
    },
    decisionTable: {
      additionalModules: testModules.concat(decisionTableAdapter)
    },
    literalExpression: {
      additionalModules: testModules.concat(literalExpressionAdapter)
    }
  }));

  beforeEach(function() {
    openView('definitions_dish');
  });


  it('should attach to element', inject(function(propertiesPanel) {

    // when
    propertiesPanel.attachTo(container);

    // then
    expect(propertiesPanel._container.parentNode).to.equal(container);
  }));


  describe('helpers', function() {

    describe('inject element id into [data-label-id] element', function() {

      function headerText(propertiesPanel) {
        return domQuery('[data-label-id]', propertiesPanel._container).textContent;
      }

      var dishDecision;

      beforeEach(inject(function(propertiesPanel, elementRegistry) {
        dishDecision = elementRegistry.get('dish-decision');
      }));


      it('should display initially', inject(function(propertiesPanel, selection) {

        // when
        selection.select(dishDecision);

        // then
        expect(headerText(propertiesPanel)).to.eql(dishDecision.id);
      }));


      it('should update on id edit',
        inject(function(propertiesPanel, selection, modeling) {

          // given
          var newId = 'BAR';

          selection.select(dishDecision);

          // when
          modeling.updateProperties(dishDecision, { id: newId });

          // then
          expect(headerText(propertiesPanel)).to.eql(newId);
        })
      );


      it('should update on id undo', inject(function(propertiesPanel, selection, commandStack, modeling) {

        // given
        var oldId = dishDecision.id;

        selection.select(dishDecision);
        modeling.updateProperties(dishDecision, { id: 'BAR' });

        // when
        commandStack.undo();

        // then
        expect(headerText(propertiesPanel)).to.eql(oldId);
      }));

    });

  });


  describe('tab selection', function() {

    function getActiveTabId(container) {
      var activeTabNode = domQuery('.dpp-properties-tab.dpp-active', container);

      return domAttr(activeTabNode, 'data-tab');
    }


    it('should keep the selected tab when changing the selected element',
      inject(function(propertiesPanel, selection, elementRegistry) {

        // select decision
        var shape = elementRegistry.get('dish-decision');
        selection.select(shape);

        // first: check selected tab
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab1');

        // select tab2
        propertiesPanel.activateTab('tab2');

        // check selected tab
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab2');

        // select another decision
        shape = elementRegistry.get('season');
        selection.select(shape);

        // check selected tab again
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab2');

      }));


    it('should select the first tab because the selected tab does not exist',
      inject(function(propertiesPanel, selection, elementRegistry) {

        // select decision table
        var shape = elementRegistry.get('dish-decision');
        selection.select(shape);

        // select tab2
        propertiesPanel.activateTab('tab2');

        // check selected tab
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab2');

        // select literal expression
        shape = elementRegistry.get('literal-expression');
        selection.select(shape);

        // check selected tab again
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab1');

      }));

  });


  describe('description for field entry', function() {

    function getDescriptionField(container, dataEntrySelector) {
      return domQuery(dataEntrySelector + ' .dpp-field-description', container);
    }

    var dishDecision;

    beforeEach(inject(function(propertiesPanel, selection, elementRegistry) {
      propertiesPanel.attachTo(container);

      dishDecision = elementRegistry.get('dish-decision ');
      selection.select(dishDecision);

    }));


    it('only text', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=myText]');

      expect(descriptionField.textContent).to.be.equal('This field is for documentation');
    }));


    it('with a markdown link', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=myLinkText]');

      expect(descriptionField.textContent).to.be.equal('For details see camunda.org');

      var link = domQuery('a', descriptionField);

      expect(link.href).to.be.equal('http://www.camunda.org/');
      expect(link.textContent).to.be.equal('camunda.org');
    }));


    it('with an html link', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=myHtmlLinkText]');

      expect(descriptionField.textContent).to.be.equal('For details see camunda.org');

      var link = domQuery('a', descriptionField);

      expect(link.href).to.be.equal('http://www.camunda.org/');
      expect(link.textContent).to.be.equal('camunda.org');
    }));


    it('with a malicious link', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=maliciousLinkText]');

      expect(descriptionField.textContent).to.be.equal('For malicious code see [javascript](javascript:alert(1))');

      var link = domQuery('a', descriptionField);

      expect(link).to.not.exist;
    }));

  });


  describe('listeners', function() {

    // Cannot be tested due to paste events not affecting document's contents per default.
    // Cf. https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
    it('should paste to [contenteditable] as plain text');
  });
});
