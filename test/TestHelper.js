import {
  act,
  fireEvent
} from '@testing-library/preact';

import TestContainer from 'mocha-test-container-support';

import semver from 'semver';

import {
  bootstrapModeler,
  inject,
  insertCSS
} from './helper';

let PROPERTIES_PANEL_CONTAINER;

global.chai.use(function(chai, utils) {

  utils.addMethod(chai.Assertion.prototype, 'jsonEqual', function(comparison) {

    var actual = JSON.stringify(this._obj);
    var expected = JSON.stringify(comparison);

    this.assert(
      actual == expected,
      'expected #{this} to deep equal #{act}',
      'expected #{this} not to deep equal #{act}',
      comparison, // expected
      this._obj, // actual
      true // show diff
    );
  });
});

export * from './helper';

export function bootstrapPropertiesPanel(diagram, options) {
  return async function() {
    const container = TestContainer.get(this);

    insertDmnStyles();
    insertCoreStyles();

    // (1) create modeler + import diagram
    const createModeler = bootstrapModeler(diagram, options);

    await act(() => createModeler.call(this));

    // (2) clean-up properties panel
    clearPropertiesPanelContainer();

    // (3) attach properties panel

    const attachPropertiesPanel = inject(function(propertiesPanel) {
      PROPERTIES_PANEL_CONTAINER = document.createElement('div');
      PROPERTIES_PANEL_CONTAINER.classList.add('properties-container');

      container.appendChild(PROPERTIES_PANEL_CONTAINER);

      return act(() => propertiesPanel.attachTo(PROPERTIES_PANEL_CONTAINER));
    });

    await attachPropertiesPanel();
  };
}

export function clearPropertiesPanelContainer() {
  if (PROPERTIES_PANEL_CONTAINER) {
    PROPERTIES_PANEL_CONTAINER.remove();
  }
}

export function changeInput(input, value) {
  fireEvent.input(input, { target: { value } });
}

export function clickInput(input) {
  fireEvent.click(input);
}

export function insertCoreStyles() {
  insertCSS(
    'properties-panel.css',
    require('@bpmn-io/properties-panel/dist/assets/properties-panel.css')
  );

  insertCSS(
    'test.css',
    require('./test.css')
  );
}

/**
 * Execute test only if currently installed @bpmn-io/properties-panel is of given version.
 *
 * @param {string} versionRange
 * @param {boolean} only
 */
export function withPropertiesPanel(versionRange, only = false) {
  if (propertiesPanelSatisfies(versionRange)) {
    return only ? it.only : it;
  } else {
    return it.skip;
  }
}

function propertiesPanelSatisfies(versionRange) {
  const version = require('@bpmn-io/properties-panel/package.json').version;

  return semver.satisfies(version, versionRange, { includePrerelease: true });
}

export function insertDmnStyles() {

  insertCSS(
    'diagram.css',
    require('dmn-js/dist/assets/diagram-js.css')
  );

  insertCSS('dmn.css',
    require('dmn-js/dist/assets/dmn-font/css/dmn.css')
  );

  insertCSS('dmn-font.css',
    require('dmn-js/dist/assets/dmn-font/css/dmn-embedded.css')
  );

  insertCSS('dmn-js-shared.css',
    require('dmn-js/dist/assets/dmn-js-shared.css')
  );

  insertCSS('dmn-js-drd.css',
    require('dmn-js/dist/assets/dmn-js-drd.css')
  );

  insertCSS('dmn-js-decision-table.css',
    require('dmn-js/dist/assets/dmn-js-decision-table.css')
  );

  insertCSS('dmn-decision-table-controls.css',
    require('dmn-js/dist/assets/dmn-js-decision-table-controls.css')
  );

  insertCSS('dmn-js-literal-expression.css',
    require('dmn-js/dist/assets/dmn-js-literal-expression.css')
  );
}
