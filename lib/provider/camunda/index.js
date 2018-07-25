module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate').default
  ],
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', require('./CamundaPropertiesProvider') ]
};
