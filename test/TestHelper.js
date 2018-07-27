'use strict';

import {
  insertCSS
} from './helper';

import {
  query as domQuery,
  queryAll as domQueryAll,
  attr as domAttr
} from 'min-dom';

import matchers from './matchers';

insertCSS('diagram-js.css',
  require('diagram-js/assets/diagram-js.css')
);

insertCSS('dmn-font.css',
  require('dmn-js/dist/assets/dmn-font/css/dmn-embedded.css')
);

insertCSS('dmn-js-shared.css',
  require('dmn-js/dist/assets/dmn-js-shared.css')
);

insertCSS('dmn-js-drd.css',
  require('dmn-js/dist/assets/dmn-js-drd.css')
);

insertCSS('dmn-js-decision-table.css',
  require('dmn-js/dist/assets/dmn-js-decision-table.css')
);

insertCSS('dmn-decision-table-controls.css',
  require('dmn-js/dist/assets/dmn-js-decision-table-controls.css')
);

insertCSS('dmn-js-literal-expression.css',
  require('dmn-js/dist/assets/dmn-js-literal-expression.css')
);

insertCSS('properties.css', require('dist/assets/dmn-js-properties-panel.css'));

insertCSS('diagram-js-testing.css', require('./test.css'));

/**
 * Triggers a change event
 *
 * @param element on which the change should be triggered
 * @param eventType type of the event (e.g. click, change, ...)
 */
export function triggerEvent(element, eventType) {

  var evt;

  eventType = eventType || 'change';

  if (document.createEvent) {
    try {
      // Chrome, Safari, Firefox
      evt = new MouseEvent((eventType), { view: window, bubbles: true, cancelable: true });
    } catch (e) {
      // IE 11, PhantomJS (wat!)
      evt = document.createEvent('MouseEvent');

      evt.initEvent((eventType), true, true);
    }
    return element.dispatchEvent(evt);
  } else {
    // Welcome IE
    evt = document.createEventObject();

    return element.fireEvent('on' + eventType, evt);
  }
}

export function triggerValue(element, value, eventType) {
  if (domAttr(element, 'contenteditable')) {
    element.innerText = value;
  } else {
    element.value = value;
  }

  triggerEvent(element, eventType);
}

export function triggerInput(element, value) {
  element.value = value;

  triggerEvent(element, 'input');

  element.focus();
}

/**
 * Select a form field with the specified index in the DOM
 *
 * @param  {number} index
 * @param  {DOMElement} container
 */
export function triggerFormFieldSelection(index, container) {
  var formFieldSelectBox = domQuery('select[name=selectedExtensionElement]', container);

  formFieldSelectBox.options[index].selected = 'selected';
  triggerEvent(formFieldSelectBox, 'change');
}

/**
 *  Select the option with the given value
 *
 *  @param element contains the options
 *  @param optionValue value which should be selected
 */
export function selectedByOption(element, optionValue) {

  var options = domQueryAll('option', element);

  for (var i = 0; i< options.length; i++) {

    var option = options[i];

    if (option.value === optionValue) {
      element.selectedIndex = i;
      break;
    }
  }
}

/**
 * PhantomJS Speciality
 * @param element
 * @returns {*}
 */
export function selectedByIndex(element) {
  if (!element) {
    return null;
  }

  return element.options[element.selectedIndex];
}

global.chai.use(matchers);

