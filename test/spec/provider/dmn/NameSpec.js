'use strict';

import {
  triggerValue
} from '../../../TestHelper';

import {
  bootstrapModeler,
  inject,
  openView
} from '../../../helper';

import propertiesPanelModule from '../../../../lib';
import propertiesProviderModule from '../../../../lib/provider/dmn';

import drdAdapterModule from 'lib/adapter/drd';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import { query as domQuery } from 'min-dom';

import diagramXML from './Name.dmn';

function getEntry(container, entryId) {
  return domQuery('div[data-entry="' + entryId + '"]', container);
}

function getNameField(container) {
  var selector = 'div[name=name]';
  return domQuery(selector, getEntry(container, 'name'));
}

function getTextBoxRows(field) {
  var innerText = field.innerText || '';
  var lines = innerText.split(/\r?\n/g);
  var rows = lines.length;

  return rows;
}

describe('name-properties', function() {

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


  describe('change name', function() {

    var container, element, nameField;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      var shape = elementRegistry.get('WITHOUT_NAME');
      selection.select(shape);

      element = getBusinessObject(shape);

      nameField = getNameField(container);

      // when
      triggerValue(nameField, 'foo', 'change');
    }));


    describe('in the DOM', function() {

      it('should execute', function() {
        // then
        expect(nameField.textContent).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        expect(nameField.textContent).to.equal('');
      }));


      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(nameField.textContent).to.equal('foo');
      }));

    });


    describe('on the business object', function() {

      it('should execute', function() {
        // then
        expect(element.name).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        expect(element.name).to.be.undefined;
      }));


      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(element.name).to.equal('foo');
      }));

    });

  });


  describe('textbox rows', function() {

    it('should initialize textbox with one rows', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('ONE_LINE');

      // when
      selection.select(shape);

      // then
      var field = getNameField(propertiesPanel._container);
      expect(getTextBoxRows(field)).to.equal(1);
    }));


    it('should initialize textbox with three rows', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('FOUR_LINES');

      // when
      selection.select(shape);

      // then
      var field = getNameField(propertiesPanel._container);
      expect(getTextBoxRows(field)).to.equal(4);
    }));


    it('should grow', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('ONE_LINE');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      triggerValue(field, 'a\nb', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(2);
    }));


    it('should reduce', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('FOUR_LINES');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      triggerValue(field, 'a\nb', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(2);
    }));


    it('should set textbox rows to more than three', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('ONE_LINE');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      triggerValue(field, 'a\nb\nc\nd\ne', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(5);
    }));


    it('should set textbox rows to minimum value of one', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('FOUR_LINES');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      triggerValue(field, 'a', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(1);
    }));

  });

});
