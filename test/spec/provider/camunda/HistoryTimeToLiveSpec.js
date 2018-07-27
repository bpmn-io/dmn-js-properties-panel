'use strict';

import {
  triggerValue
} from '../../../TestHelper';

import {
  bootstrapModeler,
  inject,
  openView
} from '../../../helper';


import propertiesPanelModule from '../../../../lib';
import propertiesProviderModule from '../../../../lib/provider/camunda';

import drdAdapterModule from 'lib/adapter/drd';

import camundaModdlePackage from 'camunda-dmn-moddle/resources/camunda';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import { query as domQuery } from 'min-dom';

import diagramXML from './HistoryTimeToLive.dmn';


describe('history-time-to-live-properties', function() {

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  beforeEach(bootstrapModeler(diagramXML, {
    drd: {
      additionalModules: testModules.concat(drdAdapterModule),
    },
    moddleExtensions: {
      camunda: camundaModdlePackage
    }
  }));

  beforeEach(function() {
    openView('definitions_dish');
  });


  it('should get a history time to live', inject(function(propertiesPanel, selection, elementRegistry) {

    // given
    var shape = elementRegistry.get('dish-decision'),
        inputEl = 'input[name=historyTimeToLive]';

    // when
    selection.select(shape);

    var bo = getBusinessObject(shape),
        inputValue = domQuery(inputEl, propertiesPanel._container).value;

    // then
    expect(bo.get('historyTimeToLive')).to.equal(inputValue);
  }));


  it('should set a history time to live', inject(function(propertiesPanel, selection, elementRegistry) {

    var shape = elementRegistry.get('dish-decision'),
        inputEl = 'input[name=historyTimeToLive]';

    // given
    selection.select(shape);

    var inputElement = domQuery(inputEl, propertiesPanel._container),
        bo = getBusinessObject(shape);

    // when
    triggerValue(inputElement, 'bar', 'change');

    // then
    expect(bo.get('historyTimeToLive')).to.equal('bar');
  }));

});
