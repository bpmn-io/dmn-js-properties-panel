import {
  render
} from '@testing-library/preact/pure';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  Injector as injectorMock,
  ElementRegistry as elementRegistryMock,
  EventBus as eventBusMock
} from './mocks';

import {
  insertCoreStyles,
  withPropertiesPanel
} from 'test/TestHelper';

import DmnPropertiesPanel from 'src/render/DmnPropertiesPanel';

insertCoreStyles();

const noop = () => {};

const noopElement = {
  id: 'foo',
  type: 'foo:bar',
  businessObject: {
    get: noop
  }
};


describe('<DmnPropertiesPanel>', function() {

  let container,
      parent;

  beforeEach(function() {
    parent = TestContainer.get(this);

    container = document.createElement('div');

    container.classList.add('properties-container');

    container.style.position = 'absolute';
    container.style.right = '0';

    parent.appendChild(container);
  });


  it('should render', function() {

    // given
    const result = createDmnPropertiesPanel({ container });

    // then
    expect(domQuery('.bio-properties-panel', result.container)).to.exist;
  });


  it('should render provided groups', function() {

    // given
    const groups = [
      {
        id: 'group-1',
        label: 'Group 1',
        entries: []
      },
      {
        id: 'group-2',
        label: 'Group 2',
        entries: []
      },
      {
        id: 'group-3',
        label: 'Group 3',
        entries: []
      }
    ];

    // when
    const result = createDmnPropertiesPanel({ container, groups });

    // then
    expect(domQueryAll('.bio-properties-panel-group', result.container)).to.have.length(3);
  });


  withPropertiesPanel('>=0.14')('should render - empty', async function() {

    // given
    const element = null;

    const eventBus = new eventBusMock();

    // when
    const result = createDmnPropertiesPanel({ container, eventBus, element });

    // then
    expect(domQuery('.bio-properties-panel-placeholder', result.container)).to.exist;
    expect(domQuery('.bio-properties-panel-placeholder-text', result.container)).to.exist;
    expect(domQuery('.bio-properties-panel-placeholder-icon', result.container)).to.not.exist;
  });


  withPropertiesPanel('>=0.14')('should render - multiple', async function() {

    // given
    const newElements = [
      noopElement,
      noopElement
    ];

    const eventBus = new eventBusMock();

    // when
    const result = createDmnPropertiesPanel({ container, eventBus, element: newElements });

    // then
    expect(domQuery('.bio-properties-panel-placeholder', result.container)).to.exist;
    expect(domQuery('.bio-properties-panel-placeholder-text', result.container)).to.exist;
    expect(domQuery('.bio-properties-panel-placeholder-icon', result.container)).to.not.exist;
  });


  describe('rendering', function() {

    it('should render provided groups', function() {

      // given
      const groups = [
        {
          id: 'group-1',
          label: 'Group 1',
          entries: []
        },
        {
          id: 'group-2',
          label: 'Group 2',
          entries: []
        },
        {
          id: 'group-3',
          label: 'Group 3',
          entries: []
        }
      ];

      // when
      const result = createDmnPropertiesPanel({ container, groups });

      // then
      expect(domQueryAll('.bio-properties-panel-group', result.container)).to.have.length(3);
    });

  });

});


// helpers /////////////////////////

function createDmnPropertiesPanel(options = {}) {

  const {
    element = noopElement,
    groups = [],
    layoutConfig,
    descriptionConfig,
    descriptionLoaded,
    container
  } = options;

  let {
    elementRegistry
  } = options;

  if (!elementRegistry) {
    elementRegistry = new elementRegistryMock();
    elementRegistry.setElements([ element ]);
  }

  const injector = new injectorMock({
    ...options,
    elementRegistry
  });

  return render(
    <DmnPropertiesPanel
      element={ element }
      groups={ groups }
      injector={ injector }
      layoutConfig={ layoutConfig }
      descriptionConfig={ descriptionConfig }
      descriptionLoaded={ descriptionLoaded }
    />,
    {
      container
    }
  );
}