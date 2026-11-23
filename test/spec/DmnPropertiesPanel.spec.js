import { expect } from 'chai';
import { spy } from 'sinon';

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
  EventBus as eventBusMock,
  getProviders as getProvidersMock
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
    const groups1 = [
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

    const groups2 = [
      {
        id: 'group-4',
        label: 'Group 4',
        entries: []
      }
    ];

    const getProviders = () => {
      return [
        {
          getGroups: () => (groups) => groups.concat(groups1)
        },
        {
          getGroups: () => (groups) => groups.concat(groups2)
        }
      ];
    };

    // when
    const result = createDmnPropertiesPanel({ container, getProviders });

    // then
    expect(domQueryAll('.bio-properties-panel-group', result.container)).to.have.length(4);
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
    const element = [
      noopElement,
      noopElement
    ];

    // when
    const result = createDmnPropertiesPanel({ container, element });

    // then
    expect(domQuery('.bio-properties-panel-placeholder', result.container)).to.exist;
    expect(domQuery('.bio-properties-panel-placeholder-text', result.container)).to.exist;
    expect(domQuery('.bio-properties-panel-placeholder-icon', result.container)).to.not.exist;
  });


  describe('event emitting', function() {

    it('should notify on layout changed', function() {

      // given
      const updateSpy = spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.layoutChanged', updateSpy);

      // when
      createDmnPropertiesPanel({ container, eventBus });

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should notify on description loaded', function() {

      // given
      const loadedSpy = spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.descriptionLoaded', loadedSpy);

      // when
      createDmnPropertiesPanel({ container, eventBus });

      // then
      expect(loadedSpy).to.have.been.calledOnce;
    });

  });

});


// helpers /////////////////////////

function createDmnPropertiesPanel(options = {}) {

  const {
    element = noopElement,
    getProviders = getProvidersMock,
    layoutConfig,
    descriptionConfig,
    descriptionLoaded,
    container
  } = options;

  const injector = new injectorMock(options);

  return render(
    <DmnPropertiesPanel
      element={ element }
      injector={ injector }
      getProviders={ getProviders }
      layoutConfig={ layoutConfig }
      descriptionConfig={ descriptionConfig }
      descriptionLoaded={ descriptionLoaded }
    />,
    {
      container
    }
  );
}