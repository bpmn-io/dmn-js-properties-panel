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

import CamundaPropertiesProvider from 'src/provider/camunda';

import diagramXML from './VersionTagProps.dmn';

import CamundaModdle from 'camunda-dmn-moddle/resources/camunda';


describe('provider/camunda - VersionTagProps', function() {

  const testModules = [
    DmnPropertiesPanel,
    DmnPropertiesProvider,
    CamundaPropertiesProvider
  ];

  let container;

  afterEach(() => cleanup());

  beforeEach(bootstrapPropertiesPanel(diagramXML, {
    drd: {
      additionalModules: testModules,
      debounceInput: false
    },
    moddleExtensions: {
      camunda: CamundaModdle
    }
  }));

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should NOT display', inject(async function(elementRegistry, selection) {

    const shape = elementRegistry.get('BusinessKnowledgeModel_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const versionTagInput = domQuery('input[name=versionTag]', container);

    // then
    expect(versionTagInput).to.not.exist;
  }));


  it('should display', inject(async function(eventBus, elementRegistry, selection) {

    const shape = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const versionTagInput = domQuery('input[name=versionTag]', container);

    // then
    expect(versionTagInput.value).to.eql(getBusinessObject(shape).get('camunda:versionTag'));
  }));


  it('should update', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const versionTagInput = domQuery('input[name=versionTag]', container);
    changeInput(versionTagInput, 'v0.3.0');

    // then
    expect(getBusinessObject(shape).get('camunda:versionTag')).to.eql('v0.3.0');
  }));


  it('should update on external change',
    inject(async function(elementRegistry, selection, commandStack) {

      // given
      const shape = elementRegistry.get('Decision_1');
      const originalValue = getBusinessObject(shape).get('camunda:versionTag');

      await act(() => {
        selection.select(shape);
      });

      const versionTagInput = domQuery('input[name=versionTag]', container);
      changeInput(versionTagInput, 'v0.3.0');

      // when
      await act(() => {
        commandStack.undo();
      });

      // then
      expect(versionTagInput.value).to.eql(originalValue);
    })
  );

});