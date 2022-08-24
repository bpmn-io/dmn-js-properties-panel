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

import CamundaModdle from 'camunda-dmn-moddle/resources/camunda';

import diagramXML from './HistoryCleanupProps.dmn';


describe('provider/camunda - HistoryCleanupProps', function() {

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
    const historyTimeToLiveInput = domQuery('input[name=historyTimeToLive]', container);

    // then
    expect(historyTimeToLiveInput).to.not.exist;
  }));


  it('should display', inject(async function(elementRegistry, selection) {

    const shape = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const historyTimeToLiveInput = domQuery('input[name=historyTimeToLive]', container);

    // then
    expect(historyTimeToLiveInput.value).to.eql(getBusinessObject(shape).get('camunda:historyTimeToLive'));
  }));


  it('should update', inject(async function(elementRegistry, selection) {

    // given
    const shape = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(shape);
    });

    // when
    const historyTimeToLiveInput = domQuery('input[name=historyTimeToLive]', container);
    changeInput(historyTimeToLiveInput, '24');

    // then
    expect(getBusinessObject(shape).get('camunda:historyTimeToLive')).to.eql('24');
  }));


  it('should update on external change',
    inject(async function(elementRegistry, selection, commandStack) {

      // given
      const shape = elementRegistry.get('Decision_1');
      const originalValue = getBusinessObject(shape).get('camunda:historyTimeToLive');

      await act(() => {
        selection.select(shape);
      });

      const historyTimeToLiveInput = domQuery('input[name=historyTimeToLive]', container);
      changeInput(historyTimeToLiveInput, '24');

      // when
      await act(() => {
        commandStack.undo();
      });

      // then
      expect(historyTimeToLiveInput.value).to.eql(originalValue);
    })
  );

});