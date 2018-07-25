'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

var helper = require('test/helper'),
    bootstrapModeler = helper.bootstrapModeler,
    inject = helper.inject,
    openView = helper.openView;

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    propertiesProviderModule = require('lib/provider/camunda'),
    camundaModdlePackage = require('camunda-dmn-moddle/resources/camunda'),
    getBusinessObject = require('dmn-js-shared/lib/util/ModelUtil').getBusinessObject;

var drdAdapterModule = require('lib/adapters/drd');


describe('version-tag-properties', function() {

  var diagramXML = require('./VersionTag.dmn');

  var testModules = [
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

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

    TestHelper.triggerValue(inputElement, '', 'change');

    // when
    TestHelper.triggerValue(inputElement, '1.0.2', 'change');

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
    TestHelper.triggerValue(inputElement, '1.0.2', 'change');

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
    TestHelper.triggerValue(inputElement, '', 'change');

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
      TestHelper.triggerValue(inputElement, '', 'change');

      // when
      commandStack.undo();
      var versionTag = bo.get('camunda:versionTag');


      // then
      expect(versionTag).not.to.be.undefined;
      expect(versionTag).to.equal('1.0.0');
    }
  ));

});
