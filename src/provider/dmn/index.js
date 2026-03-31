import DmnPropertiesProvider from './DmnPropertiesProvider';
import DataTypesModule from 'dmn-js-shared/lib/features/data-types';


export default {
  __depends__: [ DataTypesModule ],
  __init__: [ 'dmnPropertiesProvider' ],
  dmnPropertiesProvider: [ 'type', DmnPropertiesProvider ]
};