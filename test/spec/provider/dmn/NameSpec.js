'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

var helper = require('test/helper'),
    bootstrapModeler = helper.bootstrapModeler,
    inject = helper.inject,
    openView = helper.openView;

var drdAdapterModule = require('lib/adapters/drd');

var propertiesPanelModule = require('../../../../lib'),
    domQuery = require('min-dom').query,
    propertiesProviderModule = require('../../../../lib/provider/dmn'),
    getBusinessObject = require('dmn-js-shared/lib/util/ModelUtil').getBusinessObject;

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

  var diagramXML = require('./Name.dmn');

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
      TestHelper.triggerValue(nameField, 'foo', 'change');
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
      TestHelper.triggerValue(field, 'a\nb', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(2);
    }));


    it('should reduce', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('FOUR_LINES');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      TestHelper.triggerValue(field, 'a\nb', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(2);
    }));


    it('should set textbox rows to more than three', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('ONE_LINE');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      TestHelper.triggerValue(field, 'a\nb\nc\nd\ne', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(5);
    }));


    it('should set textbox rows to minimum value of one', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var shape = elementRegistry.get('FOUR_LINES');
      selection.select(shape);

      var field = getNameField(propertiesPanel._container);

      // when
      TestHelper.triggerValue(field, 'a', 'change');

      // then
      expect(getTextBoxRows(field)).to.equal(1);
    }));

  });

});
