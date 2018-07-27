import cmd from './cmd';
import translate from 'diagram-js/lib/i18n/translate';

import PropertiesPanel from './PropertiesPanel';

export default {
  __depends__: [
    cmd,
    translate
  ],
  __init__: [ 'propertiesPanel' ],
  propertiesPanel: [ 'type', PropertiesPanel ]
};
