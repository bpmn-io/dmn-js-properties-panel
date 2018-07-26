var merge = require('min-dash').merge;

var TestContainer = require('mocha-test-container-support');

var DmnJS = require('dmn-js/lib/Modeler').default;

var DrdModeler = require('dmn-js-drd/lib/Modeler').default;
var DecisionTableViewer = require('dmn-js-decision-table/lib/Viewer').default;
var DecisionTableEditor = require('dmn-js-decision-table/lib/Editor').default;
var LiteralExpressionViewer = require('dmn-js-literal-expression/lib/Viewer').default;
var LiteralExpressionEditor = require('dmn-js-literal-expression/lib/Editor').default;

var DMN_JS;


/**
 * Bootstrap DmnJS given the specified options.
 *
 * @param {String} diagram - DMN diagram to import.
 * @param {Object} [options] - Options for creating DmnJS instance.
 *
 * @return {Function} a function to be passed to beforeEach
 */
function bootstrapDmnJS(diagram, options) {

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

    var _options = merge({
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
 * Bootstrap DmnJS given the specified options.
 *
 * @param {String} diagram - DMN diagram to import.
 * @param {Object} [options] - Options for creating DmnJS instance.
 *
 * @return {Function} a function to be passed to beforeEach
 */
function bootstrapModeler(diagram, options) {
  return bootstrapDmnJS(diagram, options);
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
function inject(fn) {
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

function injectAsync(doneFn) {
  return function(done) {
    var testFn = doneFn(done);

    inject(testFn)();
  };
}

function getDmnJS() {
  return DMN_JS;
}

function getActiveViewer() {
  return DMN_JS.getActiveViewer();
}

function openView(elementId) {
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

function insertCSS(name, css) {
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

module.exports = {
  bootstrapDmnJS: bootstrapDmnJS,
  bootstrapModeler: bootstrapModeler,
  inject: inject,
  injectAsync: injectAsync,
  getDmnJS: getDmnJS,
  getActiveViewer: getActiveViewer,
  openView: openView,
  insertCSS: insertCSS
};