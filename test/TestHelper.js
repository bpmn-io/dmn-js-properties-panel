'use strict';

var TestHelper = module.exports = require('./helper');

var domQuery = require('min-dom').query,
    domQueryAll = require('min-dom').queryAll,
    domAttr = require('min-dom').attr;

TestHelper.insertCSS('diagram-js.css',
  require('diagram-js/assets/diagram-js.css')
);

TestHelper.insertCSS('dmn-font.css',
  require('dmn-js/dist/assets/dmn-font/css/dmn-embedded.css')
);

TestHelper.insertCSS('dmn-js-shared.css',
  require('dmn-js/dist/assets/dmn-js-shared.css')
);

TestHelper.insertCSS('dmn-js-drd.css',
  require('dmn-js/dist/assets/dmn-js-drd.css')
);

TestHelper.insertCSS('dmn-js-decision-table.css',
  require('dmn-js/dist/assets/dmn-js-decision-table.css')
);

TestHelper.insertCSS('dmn-decision-table-controls.css',
  require('dmn-js/dist/assets/dmn-js-decision-table-controls.css')
);

TestHelper.insertCSS('dmn-js-literal-expression.css',
  require('dmn-js/dist/assets/dmn-js-literal-expression.css')
);

TestHelper.insertCSS('properties.css', require('dist/assets/dmn-js-properties-panel.css'));

TestHelper.insertCSS('diagram-js-testing.css', require('./test.css'));

/**
 * Triggers a change event
 *
 * @param element on which the change should be triggered
 * @param eventType type of the event (e.g. click, change, ...)
 */
var triggerEvent = function(element, eventType) {

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
};

var triggerValue = function(element, value, eventType) {
  if (domAttr(element, 'contenteditable')) {
    element.innerText = value;
  } else {
    element.value = value;
  }

  this.triggerEvent(element, eventType);
};

var triggerInput = function(element, value) {
  element.value = value;

  this.triggerEvent(element, 'input');

  element.focus();
};

/**
 * Select a form field with the specified index in the DOM
 *
 * @param  {number} index
 * @param  {DOMElement} container
 */
var triggerFormFieldSelection = function(index, container) {
  var formFieldSelectBox = domQuery('select[name=selectedExtensionElement]', container);

  formFieldSelectBox.options[index].selected = 'selected';
  TestHelper.triggerEvent(formFieldSelectBox, 'change');
};

/**
 *  Select the option with the given value
 *
 *  @param element contains the options
 *  @param optionValue value which should be selected
 */
var selectedByOption = function(element, optionValue) {

  var options = domQueryAll('option', element);

  for (var i = 0; i< options.length; i++) {

    var option = options[i];

    if (option.value === optionValue) {
      element.selectedIndex = i;
      break;
    }
  }
};

/**
 * PhantomJS Speciality
 * @param element
 * @returns {*}
 */
var selectedByIndex = function(element) {
  if (!element) {
    return null;
  }

  return element.options[element.selectedIndex];
};


module.exports.triggerEvent = triggerEvent;
module.exports.triggerValue = triggerValue;
module.exports.triggerInput = triggerInput;
module.exports.triggerFormFieldSelection = triggerFormFieldSelection;
module.exports.selectedByOption = selectedByOption;
module.exports.selectedByIndex = selectedByIndex;


global.chai.use(require('./matchers'));

