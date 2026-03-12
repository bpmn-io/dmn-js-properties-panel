import { expect } from 'chai';

import {
  act
} from '@testing-library/preact';

import TestContainer from 'mocha-test-container-support';

import {
  bootstrapPropertiesPanel,
  inject,
  changeInput
} from 'test/TestHelper';

import {
  query as domQuery
} from 'min-dom';

import { getBusinessObject, is } from 'dmn-js-shared/lib/util/ModelUtil';

import DmnPropertiesPanel from 'src/render';

import DmnPropertiesProvider from 'src/provider/dmn';

import diagramXML from './TypeRefProps.dmn';


describe('provider/dmn - TypeRefProps', function() {

  const testModules = [
    DmnPropertiesPanel,
    DmnPropertiesProvider
  ];

  let container;

  beforeEach(bootstrapPropertiesPanel(diagramXML, {
    drd: {
      additionalModules: testModules,
      debounceInput: false
    }
  }));

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should display type dropdown for InputData', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('WithVariable');

    await act(() => {
      selection.select(shape);
    });

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);

    // then
    expect(typeDropdown).to.exist;
    expect(typeDropdown.value).to.eql(getBusinessObject(shape).get('variable').get('typeRef'));
  }));


  it('should display Any for no type ref', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('NoType');

    await act(() => {
      selection.select(shape);
    });

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);

    // then
    expect(typeDropdown).to.exist;
    expect(typeDropdown.value).to.eql('Any');
  }));


  it('should display Any for no variable', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('NoVariable');

    await act(() => {
      selection.select(shape);
    });

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);

    // then
    expect(typeDropdown).to.exist;
    expect(typeDropdown.value).to.eql('Any');
  }));


  describe('update', function() {

    let element;

    beforeEach(inject(async function(elementRegistry, selection) {

      // given
      element = elementRegistry.get('WithVariable');

      await act(() => {
        selection.select(element);
      });
    }));


    it('should update type', async function() {

      // when
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'boolean');

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable.get('typeRef')).to.eql('boolean');
    });


    it('should undo', inject(async function(commandStack) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'boolean');

      // when
      commandStack.undo();

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable.get('typeRef')).to.eql('string');
    }));


    it('should redo', inject(async function(commandStack) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'boolean');


      // when
      commandStack.undo();
      commandStack.redo();

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable.get('typeRef')).to.eql('boolean');
    }));
  });


  describe('missing typeRef handling', function() {

    let element;

    beforeEach(inject(async function(elementRegistry, selection) {

      // given
      element = elementRegistry.get('NoType');

      await act(() => {
        selection.select(element);
      });
    }));


    it('should update type', async function() {

      // when
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'boolean');

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable.get('typeRef')).to.eql('boolean');
    });


    it('should undo', inject(async function(commandStack) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'boolean');

      // when
      commandStack.undo();

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable.get('typeRef')).not.to.exist;
    }));


    it('should redo', inject(async function(commandStack) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'boolean');


      // when
      commandStack.undo();
      commandStack.redo();

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable.get('typeRef')).to.eql('boolean');
    }));
  });


  describe('missing variable handling', function() {

    let element;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      element = elementRegistry.get('NoVariable');

      return act(() => {
        selection.select(element);
      });
    }));


    it('should add variable if missing', async function() {

      // when
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'string');

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable).to.exist;
      expect(is(variable, 'dmn:InformationItem'), 'variable should be an InformationItem').to.be.true;
      expect(variable.get('typeRef')).to.eql('string');
    });


    it('should undo', inject(async function(commandStack) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'string');

      // when
      commandStack.undo();

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');
      expect(variable).not.to.exist;
    }));


    it('should redo', inject(async function(commandStack) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'string');

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      const businessObject = getBusinessObject(element);
      const variable = businessObject.get('variable');

      expect(variable).to.exist;
      expect(is(variable, 'dmn:InformationItem'), 'variable should be an InformationItem').to.be.true;
      expect(variable.get('typeRef')).to.eql('string');
    }));
  });
});
