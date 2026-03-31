import { expect } from 'chai';

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

  afterEach(function() { return cleanup(); });

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
    const shape = elementRegistry.get('dayType_id');

    await act(() => {
      selection.select(shape);
    });

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);

    // then
    expect(typeDropdown).to.exist;
    expect(typeDropdown.value).to.eql(getBusinessObject(shape).get('variable').get('typeRef'));
  }));

  it('should update type for Decision', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('literal-expression');

    await act(() => {
      selection.select(shape);
    });

    const originalType = getBusinessObject(shape).get('variable').get('typeRef');

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);
    changeInput(typeDropdown, 'boolean');


    // then
    expect(typeDropdown.value).to.eql('boolean');
    expect(originalType).to.not.eql(typeDropdown.value);
  }));

  it('should undo and redo type change', inject(async function(elementRegistry, selection, commandStack) {

    // given
    const shape = elementRegistry.get('dayType_id');
    const originalValue = getBusinessObject(shape).get('variable').get('typeRef');

    await act(() => {
      selection.select(shape);
    });

    const typeDropdown = domQuery('select[name=typeRef]', container);
    changeInput(typeDropdown, 'boolean');

    // when
    await act(() => {
      commandStack.undo();
    });

    // then
    expect(typeDropdown.value).to.eql(originalValue);

    // when
    await act(() => {
      commandStack.redo();
    });

    // then
    expect(typeDropdown.value).to.eql('boolean');
  }));

  it('should add variable if missing', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('dayType_id');
    const businessObject = getBusinessObject(shape);

    // ensure variable is missing
    businessObject.variable = null;

    await act(() => {
      selection.select(shape);
    });

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);
    changeInput(typeDropdown, 'string');

    // then
    const variable = businessObject.get('variable');
    expect(variable).to.exist;
    expect(is(variable, 'dmn:InformationItem'), 'variable should be an InformationItem').to.be.true;
    expect(variable.get('typeRef')).to.eql('string');
  }));

});