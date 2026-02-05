import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import {
  act,
  waitFor
} from '@testing-library/preact';

import {
  bootstrapPropertiesPanel,
  changeInput,
  inject,
  mouseEnter
} from 'test/TestHelper';

import {
  query as domQuery
} from 'min-dom';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import DmnPropertiesPanel from 'src/render';

import DmnPropertiesProvider from 'src/provider/dmn';

import ZeebePropertiesProvider from 'src/provider/zeebe';

import ZeebeModdle from 'zeebe-dmn-moddle/resources/zeebe';

import TooltipProvider from 'src/contextProvider/zeebe/TooltipProvider';

import {
  getExtensionElementsList
} from 'src/provider/utils/ExtensionElementsUtil';

import diagramXML from './VersionTagProps.dmn';


describe('provider/zeebe - VersionTagProps', function() {

  const testModules = [
    DmnPropertiesPanel,
    DmnPropertiesProvider,
    ZeebePropertiesProvider
  ];

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapPropertiesPanel(diagramXML, {
    drd: {
      additionalModules: testModules,
      debounceInput: false,
      propertiesPanel: {
        tooltip: TooltipProvider
      }
    },
    moddleExtensions: {
      zeebe: ZeebeModdle
    }
  }));


  it('should NOT display for input', inject(async function(elementRegistry, selection) {

    // given
    const input = elementRegistry.get('Input_1');

    await act(() => {
      selection.select(input);
    });

    // when
    const versionTagInput = domQuery('input[name=versionTag]', container);

    // then
    expect(versionTagInput).to.not.exist;
  }));


  it('should display for decision', inject(async function(elementRegistry, selection) {

    // given
    const element = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(element);
    });

    // when
    const versionTagInput = domQuery('input[name=versionTag]', container);

    // then
    expect(versionTagInput).to.exist;
    expect(versionTagInput.value).to.eql(getVersionTag(element).get('value'));
  }));


  it('should update', inject(async function(elementRegistry, selection) {

    // given
    const element = elementRegistry.get('Decision_1');

    await act(() => {
      selection.select(element);
    });

    // when
    const versionTagInput = domQuery('input[name=versionTag]', container);

    changeInput(versionTagInput, 'v2.0.0');

    // then
    expect(getVersionTag(element).get('value')).to.eql('v2.0.0');
  }));


  it('should update on external change',
    inject(async function(elementRegistry, selection, commandStack) {

      // given
      const element = elementRegistry.get('Decision_1');

      const originalValue = getVersionTag(element).get('value');

      await act(() => {
        selection.select(element);
      });

      const versionTagInput = domQuery('input[name=versionTag]', container);

      changeInput(versionTagInput, 'v2.0.0');

      // when
      await act(() => {
        commandStack.undo();
      });

      // then
      expect(versionTagInput.value).to.eql(originalValue);
    })
  );


  it('should create non existing extension elements',
    inject(async function(elementRegistry, modeling, selection) {

      // given
      const element = elementRegistry.get('Decision_1');

      modeling.updateModdleProperties(element, getBusinessObject(element), { extensionElements: undefined });

      // assume
      expect(getBusinessObject(element).get('extensionElements')).to.not.exist;

      await act(() => {
        selection.select(element);
      });

      // when
      const versionTagInput = domQuery('input[name=versionTag]', container);

      changeInput(versionTagInput, 'v1.0.0');

      // then
      expect(getBusinessObject(element).get('extensionElements')).to.exist;
      expect(getVersionTag(element).get('value')).to.eql('v1.0.0');
    })
  );


  it('should create non existing version tag',
    inject(async function(elementRegistry, modeling, selection) {

      // given
      const element = elementRegistry.get('Decision_1');

      modeling.updateModdleProperties(
        element,
        getBusinessObject(element).get('extensionElements'),
        { values: [] }
      );

      // assume
      expect(getBusinessObject(element).get('extensionElements')).to.exist;
      expect(getVersionTag(element)).not.to.exist;

      await act(() => {
        selection.select(element);
      });

      // when
      const versionTagInput = domQuery('input[name=versionTag]', container);

      changeInput(versionTagInput, 'v1.0.0');

      // then
      expect(getVersionTag(element)).to.exist;
      expect(getVersionTag(element).get('value')).to.eql('v1.0.0');
    })
  );


  it('should display correct documentation', inject(
    async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get('Decision_1');

      await act(() => {
        selection.select(element);
      });

      // when
      await toggleGroup('general', container);
      await openTooltip('versionTag', container);

      const tooltipEl = domQuery('.bio-properties-panel-tooltip-content p', container);

      // then
      expect(tooltipEl).to.exist;
      expect(tooltipEl.textContent).to.match(/Version tag by which this decision can be referenced./);
    }
  ));

});


// helpers //////////////////

function getVersionTag(element) {
  const businessObject = getBusinessObject(element);

  return getExtensionElementsList(businessObject, 'zeebe:VersionTag')[ 0 ];
}

function toggleGroup(id, container) {
  const headerEl = domQuery(`[data-group-id="group-${id}"] > .bio-properties-panel-group-header`);

  return act(() => headerEl.click());
}

async function openTooltip(id, container) {

  const wrapperEl = domQuery(`[data-entry-id="${id}"] .bio-properties-panel-tooltip-wrapper`, container);

  await act(() => {
    mouseEnter(wrapperEl);
  });

  return waitFor(() => {
    expect(domQuery('.bio-properties-panel-tooltip', wrapperEl)).to.exist;
  });
}