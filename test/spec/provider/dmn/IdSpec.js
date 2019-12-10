'use strict';

import { triggerValue } from '../../../TestHelper';

import {
  bootstrapModeler,
  inject,
  openView
} from '../../../helper';

import propertiesPanelModule from '../../../../lib';
import propertiesProviderModule from '../../../../lib/provider/dmn';

import drdAdapterModule from 'lib/adapter/drd';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import diagramXML from './Id.dmn';


describe('id-properties', function() {

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var shape,
      getTextField,
      textField,
      businessObject;

  beforeEach(bootstrapModeler(diagramXML, {
    drd: {
      additionalModules: testModules.concat(drdAdapterModule)
    }
  }));

  beforeEach(function() {
    openView('definitions_dish');
  });

  beforeEach(inject(function(commandStack, propertiesPanel, selection, elementRegistry) {

    shape = elementRegistry.get('dish-decision');
    selection.select(shape);

    getTextField = function() {
      return domQuery('input[name=id]', propertiesPanel._container);
    };

    textField = getTextField();

    businessObject = getBusinessObject(shape);
  }));


  it('should fetch the id for an element', inject(function(propertiesPanel) {

    // when selecting element

    // then
    expect(textField.value).to.equal(businessObject.get('id'));
  }));


  describe('set', function() {

    it('should set the id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, 'foo', 'change');

      // then
      expect(getTextField().value).to.equal('foo');
      expect(businessObject.get('id')).to.equal('foo');
    }));


    it('should not remove the id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    }));


    it('should not set the id with a space for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, 'foo bar', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    }));


    it('should not set invalid QName id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '::FOO', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    }));


    it('should not set invalid HTML characters id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '<hello>', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    }));


    it('should not set the id with the expression at the beginning', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '${VERSION_TAG}_foo', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


    it('should not set the id with the expression at the end', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, 'foo_${VERSION_TAG}', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


    it('should not set the id with the expression in the middle', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, 'foo_${VERSION_TAG}_bar', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


    it('should not set the id which is only an expression', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '${VERSION_TAG}', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


    it('should not set the id which have an invalid QName inside the expression', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '${VERSION:TAG}', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


    it('should not set the id which have only numbers inside the expression', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '${123}', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


    it('should not set the id which have no text inside the expression', function() {

      // assume
      expect(textField.value).to.equal('dish-decision');

      // when
      triggerValue(textField, '${}', 'change');

      // then
      expect(businessObject.get('id')).to.equal('dish-decision');
    });


  });


  describe('validation errors', function() {

    it('should not be shown if id is valid', function() {

      // when
      triggerValue(textField, 'foo', 'change');

      // then
      expect(domClasses(getTextField()).has('invalid')).to.be.false;
    });


    it('should be shown if id gets removed', function() {

      // when
      triggerValue(textField, '', 'change');

      // then
      expect(domClasses(getTextField()).has('invalid')).to.be.true;
    });


    it('should be shown if id contains space', function() {

      // when
      triggerValue(textField, 'foo bar', 'change');

      // then
      expect(domClasses(getTextField()).has('invalid')).to.be.true;
    });


    it('should be shown if id is invalid QName', function() {

      // when
      triggerValue(textField, '::FOO', 'change');

      // then
      expect(domClasses(getTextField()).has('invalid')).to.be.true;
    });


    it('should be shown if id contains HTML characters', function() {

      // when
      triggerValue(textField, '<hello>', 'change');

      // then
      expect(domClasses(getTextField()).has('invalid')).to.be.true;
    });

  });

});
