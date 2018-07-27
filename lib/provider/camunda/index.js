import translate from 'diagram-js/lib/i18n/translate';

import CamundaPropertiesProvider from './CamundaPropertiesProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', CamundaPropertiesProvider ]
};
