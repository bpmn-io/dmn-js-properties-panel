'use strict';

import entryFactory from '../../../../factory/EntryFactory';

/**
 * Create an entry to modify the name of an an element.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} options
 * @param  {string} options.id the id of the entry
 * @param  {string} options.label the label of the entry
 *
 * @return {Array<Object>} return an array containing
 *                         the entry to modify the name
 */
export default function(element, translate) {

  var id = 'name',
      label = translate('Name'),
      modelProperty = 'name';

  var nameEntry = entryFactory.textBox({
    id: id,
    label: label,
    modelProperty: modelProperty
  });

  return [ nameEntry ];

}
