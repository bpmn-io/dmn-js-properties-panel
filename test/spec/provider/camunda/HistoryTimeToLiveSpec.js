'use strict';

var TestHelper = require('../../../TestHelper');

var helper = require('test/helper'),
    bootstrapModeler = helper.bootstrapModeler,
    inject = helper.inject,
    openView = helper.openView;

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    propertiesProviderModule = require('lib/provider/camunda'),
    camundaModdlePackage = require('camunda-dmn-moddle/resources/camunda'),
    getBusinessObject = require('dmn-js-shared/lib/util/ModelUtil').getBusinessObject;

var drdAdapterModule = require('lib/adapter/drd');


describe('history-time-to-live-properties', function() {
  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];


  var diagramXML = require('./HistoryTimeToLive.dmn');

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
    TestHelper.triggerValue(inputElement, 'bar', 'change');

    // then
    expect(bo.get('historyTimeToLive')).to.equal('bar');
  }));

});
