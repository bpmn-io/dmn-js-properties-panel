'use strict';

import inherits from 'inherits';

import PropertiesActivator from '../../../lib/PropertiesActivator';

import entryFactory from '../../../lib/factory/EntryFactory';

import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


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
        }),
        entryFactory.textField({
          id : 'myHtmlLinkText',
          label : 'myHtmlLinkText',
          description: 'For details see <a href="http://www.camunda.org">camunda.org</a>',
          modelProperty : 'myHtmlLinkText'
        }),
        entryFactory.textField({
          id : 'maliciousLinkText',
          label : 'maliciousLinkText',
          description: 'For malicious code see [javascript](javascript:alert(1))',
          modelProperty : 'maliciousLinkText'
        })
      ]
    },
    {
      id: 'inputs',
      entries: [
        {
          id: 'contenteditable',
          html: '<div>Content editable:<div contenteditable></div></div>'
        }
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

    var decisionLogic = getBusinessObject(element).decisionLogic;

    if (is(decisionLogic, 'dmn:DecisionTable')) {
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

export default PropertiesProvider;
