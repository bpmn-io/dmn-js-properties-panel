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

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import DmnPropertiesPanel from 'src/render';

import DmnPropertiesProvider from 'src/provider/dmn';

import diagramXML from './IdProps.dmn';


describe('provider/dmn - IdProps', function() {

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


  it('should display', inject(async function(eventBus, elementRegistry, selection) {

    const shape = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const idInput = domQuery('input[name=id]', container);

    // then
    expect(idInput.value).to.eql(getBusinessObject(shape).get('id'));
  }));


  it('should update', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const idInput = domQuery('input[name=id]', container);
    changeInput(idInput, 'NewID');

    // then
    expect(getBusinessObject(shape).get('id')).to.eql('NewID');
  }));


  it('should update on external change',
    inject(async function(elementRegistry, selection, commandStack) {

      // given
      const shape = elementRegistry.get('Decision_1');
      const originalValue = getBusinessObject(shape).get('id');

      await act(() => {
        selection.select(shape);
      });

      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, 'NewID');

      // when
      await act(() => {
        commandStack.undo();
      });

      // then
      expect(idInput.value).to.eql(originalValue);
    })
  );


  describe('validation', function() {

    it('should NOT remove id', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, '');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));


    it('should NOT set existing id', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, 'Input_1');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));


    it('should NOT set with spaces', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, 'foo bar');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));


    it('should NOT set invalid QName', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, '::foo');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));


    it('should NOT set prefix', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, 'foo:Decision_1');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));


    it('should NOT set invalid HTML characters', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, '<foo>');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));


    it('should NOT set expression', inject(async function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(shape);
      });

      // when
      const idInput = domQuery('input[name=id]', container);
      changeInput(idInput, '${foo}');

      // then
      expect(getBusinessObject(shape).get('id')).to.eql('Decision_1');
    }));

  });

});