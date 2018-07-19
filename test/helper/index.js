import {
  assign,
  isFunction,
  merge
} from 'min-dash';

import TestContainer from 'mocha-test-container-support';

import DmnModeler from 'dmn-js/lib/Modeler';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableViewer from 'dmn-js-decision-table/lib/Viewer';
import DecisionTableEditor from 'dmn-js-decision-table/lib/Editor';
import LiteralExpressionViewer from 'dmn-js-literal-expression/lib/Viewer';
import LiteralExpressionEditor from 'dmn-js-literal-expression/lib/Editor';

var OPTIONS, DMN_JS;


/**
 * Bootstrap the modeler given the specified options and a
 * number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapDiagram(function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {Object} [options] optional options to be passed to the
 *                            diagram upon instantiation
 * @param  {Object|Function}  locals  the local overrides to be used
 *                            by the diagram or a function that produces
 *                            them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapDmnJS(DmnJS, diagram, options, locals) {

  return function(done) {

    var testContainer;
    // Make sure the test container is an optional dependency and we fall back
    // to an empty <div> if it does not exist.
    //
    // This is needed if other libraries rely on this helper for testing
    // while not adding the mocha-test-container-support as a dependency.
    try {
      testContainer = TestContainer.get(this);
    } catch (e) {
      testContainer = document.createElement('div');
      document.body.appendChild(testContainer);
    }

    testContainer.classList.add('test-container');

    var editorContainer = document.createElement('div');

    editorContainer.classList.add('editor-container');

    testContainer.appendChild(editorContainer);

    var propertiesContainer = document.createElement('div');

    propertiesContainer.classList.add('properties-container');

    testContainer.appendChild(propertiesContainer);

    if (typeof diagram !== 'string') {
      options = diagram;
      locals = options;
      diagram = undefined;
    }

    var _options = options,
        _locals = locals,
        _modules;

    if (!_locals && isFunction(_options)) {
      _locals = _options;
      _options = {};
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    // _modules = (_options || {})._modules || [];

    // if (_locals) {
    //   var mockModule = {};

    //   forEach(_locals, function(v, k) {
    //     mockModule[k] = ['value', v];
    //   });

    //   _modules = [].concat(_modules, [ mockModule ]);
    // }

    // if (_modules.length === 0) {
    //   _modules = undefined;
    // }

    // TODO(philippfromme): refactor
    _options = merge({
      container: editorContainer,
      drd: options.drd && {
        propertiesPanel: {
          parent: propertiesContainer,
        },
        modules: (options.drd && options.drd.modules) ? [] : DrdModeler.prototype._modules
      },
      decisionTable: options.decisionTable && {
        propertiesPanel: {
          parent: propertiesContainer
        },
        modules: (options.decisionTable && options.decisionTable.modules) ?
          [] :
          DecisionTableViewer._getModules().concat(DecisionTableEditor._getModules())
      },
      literalExpression: options.literalExpression && {
        propertiesPanel: {
          parent: propertiesContainer
        },
        modules: (options.literalExpression && options.literalExpression.modules) ?
          [] :
          LiteralExpressionViewer._getModules().concat(LiteralExpressionEditor._getModules())
      }
    }, options);

    // remove previous instance
    if (DMN_JS) {
      DMN_JS.destroy();
    }

    DMN_JS = new DmnJS(_options);

    DMN_JS.importXML(diagram, done);

    return DMN_JS;
  };
}

/**
 * Injects services of an instantiated diagram into the argument.
 *
 * Use it in conjunction with {@link #bootstrapModeler}.
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapModeler(...));
 *
 *   it('should provide mocked events', inject(function(events) {
 *     expect(events).toBe(mockEvents);
 *   }));
 *
 * });
 *
 * @param  {Function} fn the function to inject to
 * @return {Function} a function that can be passed to it to carry out the injection
 */
export function inject(fn) {
  return function() {

    if (!DMN_JS) {
      throw new Error(
        'no bootstraped modeler, ' +
        'ensure you created it via #bootstrapModeler'
      );
    }

    var view = getActiveViewer();

    if (!view) {
      throw new Error('no active view found');
    }

    view.invoke(fn);
  };
}

export function injectAsync(doneFn) {
  return function(done) {
    var testFn = doneFn(done);

    inject(testFn)();
  };
}

/**
 * Bootstrap the Modeler given the specified options
 * and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapModeler('some-xml', function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {String} xml document to display
 * @param  {Object} (options) optional options to be passed
 *                            to the diagram upon instantiation
 * @param  {Object|Function} locals the local overrides to be
 *                           used by the diagram or a function
 *                           that produces them
 *
 * @return {Function} a function to be passed to beforeEach
 */
export function bootstrapModeler(diagram, options, locals) {
  return bootstrapDmnJS(DmnModeler, diagram, options, locals);
}

export function getDmnJS() {
  return DMN_JS;
}

export function getActiveViewer() {
  return DMN_JS.getActiveViewer();
}

export function openView(elementId) {
  if (!DMN_JS) {
    throw new Error(
      'no bootstraped modeler, ' +
      'ensure you created it via #bootstrapModeler'
    );
  }

  var view = DMN_JS.getViews().filter(function(v) {
    return v.element.id === elementId;
  })[0];

  if (!view) {
    throw new Error(
      'no view for element with ID' + elementId
    );
  }

  DMN_JS.open(view);
}

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}