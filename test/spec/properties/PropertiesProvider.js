'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('../../../lib/PropertiesActivator');

var entryFactory = require('../../../lib/factory/EntryFactory');

var getBusinessObject = require('dmn-js-shared/lib/util/ModelUtil').getBusinessObject;


function createGroups(element) {
  return [
    {
      id: 'foo',
      entries: [
        {
          id: 'text-only',
          description: 'some auxilary text',
          html: 'this is just text, nothing special here!!!'
        },
        entryFactory.textBox({
          id : 'myText',
          label : 'myText',
          description: 'This field is for documentation',
          modelProperty : 'myText'
        }),
        entryFactory.textField({
          id : 'myLinkText',
          label : 'myLinkText',
          description: 'For details see [camunda.org](http://www.camunda.org)',
          modelProperty : 'myLinkText'
        })
      ]
    }
  ];
}

function PropertiesProvider(eventBus) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var tabs = [{
      id: 'tab1',
      label: 'Tab 1',
      groups: createGroups(element)
    }];

    if (getBusinessObject(element).decisionTable) {
      tabs.push({
        id: 'tab2',
        label: 'Tab 2',
        groups: createGroups(element)
      });
    }

    return tabs;

  };
}

inherits(PropertiesProvider, PropertiesActivator);

module.exports = PropertiesProvider;
