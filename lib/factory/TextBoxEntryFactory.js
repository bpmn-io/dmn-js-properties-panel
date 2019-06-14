import { escapeHTML } from '../Utils';

import entryFieldDescription from './EntryFieldDescription';


var textBox = function(options, defaultParameters) {

  var resource = defaultParameters,
      label = options.label || resource.id,
      canBeShown = !!options.show && typeof options.show === 'function',
      description = options.description;

  resource.html =
    '<label for="camunda-' + resource.id + '" ' +
    (canBeShown ? 'data-show="isShown"' : '') +
    '>' + escapeHTML(label) + '</label>' +
    '<div class="dpp-field-wrapper" ' +
    (canBeShown ? 'data-show="isShown"' : '') +
    '>' +
      '<div contenteditable="true" id="camunda-' + escapeHTML(resource.id) + '" ' +
            'name="' + escapeHTML(options.modelProperty) + '" />' +
    '</div>';

  // add description below text box entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  if (canBeShown) {
    resource.isShown = function() {
      return options.show.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['dpp-textbox'];

  return resource;
};

export default textBox;
