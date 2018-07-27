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

import diagramXML from './VersionTag.dmn';


describe('version-tag-properties', function() {

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


  it('should add attribute when not empty', inject(function(propertiesPanel, selection, elementRegistry) {

    var shape = elementRegistry.get('dish-decision'),
        inputEl = 'input[name=versionTag]';

    // given
    selection.select(shape);
    var bo = getBusinessObject(shape),
        inputElement = domQuery(inputEl, propertiesPanel._container);

    triggerValue(inputElement, '', 'change');

    // when
    triggerValue(inputElement, '1.0.2', 'change');

    // then
    expect(bo.get('camunda:versionTag')).to.equal('1.0.2');
  }));


  it('should fetch the value of the attribute', inject(function(propertiesPanel, selection, elementRegistry) {

    // given
    var shape = elementRegistry.get('season');

    // when
    selection.select(shape);
    var bo = getBusinessObject(shape);

    // then
    expect(bo.get('camunda:versionTag')).to.equal('1.0.0');
  }));


  it('should modify the value of the attribute', inject(function(propertiesPanel, selection, elementRegistry) {

    var shape = elementRegistry.get('season'),
        inputEl = 'input[name=versionTag]';

    // given
    selection.select(shape);
    var bo = getBusinessObject(shape),
        inputElement = domQuery(inputEl, propertiesPanel._container);

    // when
    triggerValue(inputElement, '1.0.2', 'change');

    // then
    expect(bo.get('camunda:versionTag')).to.equal('1.0.2');
  }));


  it('should remove attribute when value is empty', inject(function(propertiesPanel, selection, elementRegistry) {

    var shape = elementRegistry.get('season'),
        inputEl = 'input[name=versionTag]';

    // given
    selection.select(shape);

    var bo = getBusinessObject(shape),
        inputElement = domQuery(inputEl, propertiesPanel._container);

    // when
    triggerValue(inputElement, '', 'change');

    // then
    expect(bo.get('camunda:versionTag')).to.be.undefined;
  }));


  it('should add attribute when the remove is undone', inject(
    function(propertiesPanel, selection, elementRegistry, commandStack) {

      var shape = elementRegistry.get('season'),
          inputEl = 'input[name=versionTag]';


      selection.select(shape);

      var bo = getBusinessObject(shape),
          inputElement = domQuery(inputEl, propertiesPanel._container);

      // given
      triggerValue(inputElement, '', 'change');

      // when
      commandStack.undo();
      var versionTag = bo.get('camunda:versionTag');


      // then
      expect(versionTag).not.to.be.undefined;
      expect(versionTag).to.equal('1.0.0');
    }
  ));

});
