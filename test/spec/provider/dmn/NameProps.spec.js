import {
  act,
  cleanup
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

import diagramXML from './NameProps.dmn';


describe('provider/dmn - NameProps', function() {

  const testModules = [
    DmnPropertiesPanel,
    DmnPropertiesProvider
  ];

  let container;

  afterEach(() => cleanup());

  beforeEach(bootstrapPropertiesPanel(diagramXML, {
    drd: {
      additionalModules: testModules,
      debounceInput: false
    }
  }));

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should display', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('ONE_LINE');

    await act(() => {
      selection.select(shape);
    });

    // when
    const idInput = domQuery('input[name=name]', container);

    // then
    expect(idInput.value).to.eql(getBusinessObject(shape).get('name'));
  }));


  it('should update', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('ONE_LINE');

    await act(() => {
      selection.select(shape);
    });

    // when
    const nameInput = domQuery('input[name=name]', container);
    changeInput(nameInput, 'newValue');

    // then
    expect(getBusinessObject(shape).get('name')).to.eql('newValue');
  }));


  it('should update on external change',
    inject(async function(elementRegistry, selection, commandStack) {

      // given
      const shape = elementRegistry.get('ONE_LINE');
      const originalValue = getBusinessObject(shape).get('name');

      await act(() => {
        selection.select(shape);
      });
      const nameInput = domQuery('input[name=name]', container);
      changeInput(nameInput, 'newValue');

      // when
      await act(() => {
        commandStack.undo();
      });

      // then
      expect(nameInput.value).to.eql(originalValue);
    })
  );

});

