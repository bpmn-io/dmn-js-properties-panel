import { merge } from 'min-dash';

import TestContainer from 'mocha-test-container-support';

import DmnJS from 'dmn-js/lib/Modeler';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableViewer from 'dmn-js-decision-table/lib/Viewer';
import DecisionTableEditor from 'dmn-js-decision-table/lib/Editor';
import LiteralExpressionViewer from 'dmn-js-literal-expression/lib/Viewer';
import LiteralExpressionEditor from 'dmn-js-literal-expression/lib/Editor';

let DMN_JS;


/**
 * Bootstrap DmnJS given the specified options.
 *
 * @param {String} diagram - DMN diagram to import.
 * @param {Object} [options] - Options for creating DmnJS instance.
 *
 * @return {Function} a function to be passed to beforeEach
 */
export function bootstrapDmnJS(diagram, options) {

  return function() {

    let testContainer;

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

    let editorContainer = document.createElement('div');

    editorContainer.classList.add('modeler-container');

    testContainer.appendChild(editorContainer);

    let _options = merge({
      container: editorContainer,
      drd: options.drd && {
        modules: (options.drd && options.drd.modules) ? [] : DrdModeler.prototype._modules
      },
      decisionTable: options.decisionTable && {
        modules: (options.decisionTable && options.decisionTable.modules) ?
          [] :
          DecisionTableViewer._getModules().concat(DecisionTableEditor._getModules())
      },
      literalExpression: options.literalExpression && {
        modules: (options.literalExpression && options.literalExpression.modules) ?
          [] :
          LiteralExpressionViewer._getModules().concat(LiteralExpressionEditor._getModules())
      }
    }, options);

    // remove previous instance
    if (DMN_JS) {
      DMN_JS.destroy();
    }

    DMN_JS = new DmnJS({
      container: editorContainer,
      ..._options
    });

    return DMN_JS.importXML(diagram);
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
export function bootstrapModeler(diagram, options) {
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
 *   let mockEvents;
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

    let view = getActiveViewer();

    if (!view) {
      throw new Error('no active view found');
    }

    view.invoke(fn);
  };
}

export function injectAsync(doneFn) {
  return function(done) {
    let testFn = doneFn(done);

    inject(testFn)();
  };
}

export function getDmnJS() {
  return DMN_JS;
}

export function setDmnJS(instance) {
  DMN_JS = instance;
}

export function clearDmnJS(instance) {

  // clean up old dmn-js instance
  if (DMN_JS) {
    DMN_JS.destroy();

    DMN_JS = null;
  }
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

  let view = DMN_JS.getViews().filter(function(v) {
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

  let head = document.head || document.getElementsByTagName('head')[0],
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