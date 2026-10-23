import { expect } from 'chai';

import {
  act
} from '@testing-library/preact';

import TestContainer from 'mocha-test-container-support';

import {
  bootstrapPropertiesPanel,
  inject,
  changeInput,
  describeWithDmnJs
} from 'test/TestHelper';

import { stub } from 'sinon';

import {
  query as domQuery,
  queryAll as domQueryAll
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


  it('should NOT display type dropdown for BKM', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('BusinessKnowledgeModel');

    await act(() => {
      selection.select(shape);
    });

    // when
    const typeDropdown = domQuery('select[name=typeRef]', container);

    // then
    expect(typeDropdown).not.to.exist;
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
      expect(variable.get('name')).to.eql('No variable');
    });

    it('should add variable with empty name if element has no name', inject(async function(elementRegistry, selection) {

      // given
      const decision = elementRegistry.get('NoNameDecision');

      await act(() => {
        selection.select(decision);
      });

      // when
      const typeDropdown = domQuery('select[name=typeRef]', container);
      changeInput(typeDropdown, 'string');

      // then
      const businessObject = getBusinessObject(decision);
      const variable = businessObject.get('variable');

      expect(variable).to.exist;
      expect(is(variable, 'dmn:InformationItem'), 'variable should be an InformationItem').to.be.true;
      expect(variable.get('typeRef')).to.eql('string');
      expect(variable.get('name')).to.eql('');
    }));


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


describe('provider/dmn - TypeRefProps - data types', function() {

  const testModules = [
    DmnPropertiesPanel,
    DmnPropertiesProvider
  ];

  const BUILT_IN = { id: 'built-in', name: 'Built-ins' };

  const CUSTOM = { id: 'custom', name: 'Custom' };

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

  function selectWithDataTypes(types) {
    return inject(async function(dataTypes, elementRegistry, selection) {
      stub(dataTypes, 'getAll').returns(types);

      await act(() => {
        selection.select(elementRegistry.get('WithVariable'));
      });
    })();
  }


  describeWithDmnJs('>=18')('default', function() {

    beforeEach(inject(async function(elementRegistry, selection) {
      await act(() => {
        selection.select(elementRegistry.get('WithVariable'));
      });
    }));


    it('should group built-in and custom data types', function() {

      // then
      const groups = getGroups(container);

      expect(groups.map(group => group.label)).to.eql([ 'Built-ins', 'Custom' ]);

      expect(groups[0].options).to.include.members([ 'string', 'boolean', 'Any' ]);
      expect(groups[1].options).to.eql([ 'tCustomer' ]);
    });


    it('should display current type', function() {

      // then
      expect(domQuery('select[name=typeRef]', container).value).to.eql('string');
    });


    it('should update to custom type', inject(function(elementRegistry) {

      // given
      const typeDropdown = domQuery('select[name=typeRef]', container);

      // when
      changeInput(typeDropdown, 'tCustomer');

      // then
      const variable = getBusinessObject(elementRegistry.get('WithVariable')).get('variable');

      expect(variable.get('typeRef')).to.eql('tCustomer');
    }));

  });


  describeWithDmnJs('>=18')('grouped', function() {

    it('should display name as value and label as text', async function() {

      // when
      await selectWithDataTypes([
        { name: 'string', label: 'string', group: BUILT_IN },
        { name: 'tCustomer', label: 'Customer', group: CUSTOM }
      ]);

      // then
      const options = getOptions(container);

      expect(options).to.eql([
        { value: 'string', label: 'string' },
        { value: 'tCustomer', label: 'Customer' }
      ]);
    });


    it('should display group headers if multiple groups', async function() {

      // when
      await selectWithDataTypes([
        { name: 'string', label: 'string', group: BUILT_IN },
        { name: 'boolean', label: 'boolean', group: BUILT_IN },
        { name: 'tCustomer', label: 'Customer', group: CUSTOM },
        { name: 'tOrder', label: 'Order', group: CUSTOM }
      ]);

      // then
      expect(getGroups(container)).to.eql([
        { label: 'Built-ins', options: [ 'string', 'boolean' ] },
        { label: 'Custom', options: [ 'Customer', 'Order' ] }
      ]);
    });


    it('should group data types independent of their order', async function() {

      // when
      await selectWithDataTypes([
        { name: 'tCustomer', label: 'Customer', group: CUSTOM },
        { name: 'string', label: 'string', group: BUILT_IN },
        { name: 'tOrder', label: 'Order', group: CUSTOM },
        { name: 'boolean', label: 'boolean', group: BUILT_IN }
      ]);

      // then
      expect(getGroups(container)).to.eql([
        { label: 'Custom', options: [ 'Customer', 'Order' ] },
        { label: 'Built-ins', options: [ 'string', 'boolean' ] }
      ]);
    });


    it('should display ungrouped data types first', async function() {

      // when
      await selectWithDataTypes([
        { name: 'tCustomer', label: 'Customer', group: CUSTOM },
        { name: 'string', label: 'string' },
        { name: 'boolean', label: 'boolean' }
      ]);

      // then
      const select = domQuery('select[name=typeRef]', container);

      expect(Array.from(select.children).map(child => child.tagName)).to.eql([
        'OPTION',
        'OPTION',
        'OPTGROUP'
      ]);

      expect(getGroups(container)).to.eql([
        { label: 'Custom', options: [ 'Customer' ] }
      ]);
    });


    it('should NOT display group header if single group', async function() {

      // when
      await selectWithDataTypes([
        { name: 'string', label: 'string', group: BUILT_IN },
        { name: 'boolean', label: 'boolean', group: BUILT_IN }
      ]);

      // then
      expect(domQueryAll('optgroup', container)).to.have.length(0);

      expect(getOptions(container)).to.have.length(2);
    });


    it('should NOT display group header if no group', async function() {

      // when
      await selectWithDataTypes([
        { name: 'string', label: 'string' },
        { name: 'boolean', label: 'boolean' }
      ]);

      // then
      expect(domQueryAll('optgroup', container)).to.have.length(0);

      expect(getOptions(container)).to.have.length(2);
    });


    it('should update type to name', inject(async function(elementRegistry) {

      // given
      await selectWithDataTypes([
        { name: 'string', label: 'string', group: BUILT_IN },
        { name: 'tCustomer', label: 'Customer', group: CUSTOM }
      ]);

      const typeDropdown = domQuery('select[name=typeRef]', container);

      // when
      changeInput(typeDropdown, 'tCustomer');

      // then
      const variable = getBusinessObject(elementRegistry.get('WithVariable')).get('variable');

      expect(variable.get('typeRef')).to.eql('tCustomer');
      expect(typeDropdown.value).to.eql('tCustomer');
    }));


    it('should keep type missing in data types', inject(async function(elementRegistry) {

      // when
      await selectWithDataTypes([
        { name: 'boolean', label: 'boolean', group: BUILT_IN },
        { name: 'tCustomer', label: 'Customer', group: CUSTOM }
      ]);

      // then
      // current type, `string`, is neither added as an option nor changed
      const typeDropdown = domQuery('select[name=typeRef]', container);

      expect(getOptions(container).map(option => option.value)).to.eql([
        'boolean',
        'tCustomer'
      ]);

      expect(typeDropdown.value).to.eql('');

      const variable = getBusinessObject(elementRegistry.get('WithVariable')).get('variable');

      expect(variable.get('typeRef')).to.eql('string');
    }));

  });


  describe('strings', function() {

    it('should display strings as value and text', async function() {

      // when
      await selectWithDataTypes([ 'string', 'boolean', 'Any' ]);

      // then
      expect(getOptions(container)).to.eql([
        { value: 'string', label: 'string' },
        { value: 'boolean', label: 'boolean' },
        { value: 'Any', label: 'Any' }
      ]);

      expect(domQueryAll('optgroup', container)).to.have.length(0);
    });


    it('should display current type', async function() {

      // when
      await selectWithDataTypes([ 'string', 'boolean', 'Any' ]);

      // then
      expect(domQuery('select[name=typeRef]', container).value).to.eql('string');
    });


    it('should update type', inject(async function(elementRegistry) {

      // given
      await selectWithDataTypes([ 'string', 'boolean', 'Any' ]);

      const typeDropdown = domQuery('select[name=typeRef]', container);

      // when
      changeInput(typeDropdown, 'boolean');

      // then
      const variable = getBusinessObject(elementRegistry.get('WithVariable')).get('variable');

      expect(variable.get('typeRef')).to.eql('boolean');
    }));

  });

});


// helpers //////////

function getOptions(container) {
  const select = domQuery('select[name=typeRef]', container);

  return Array.from(select.querySelectorAll('option')).map(option => ({
    value: option.value,
    label: option.textContent
  }));
}

function getGroups(container) {
  return Array.from(domQueryAll('select[name=typeRef] optgroup', container)).map(group => ({
    label: group.label,
    options: Array.from(group.querySelectorAll('option')).map(o => o.textContent)
  }));
}
