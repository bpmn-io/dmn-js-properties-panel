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
  EventBus as eventBusMock,
  getProviders as getProvidersMock
} from './mocks';

import {
  insertCoreStyles
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


  describe('event emitting', function() {

    it('should update on selection changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createDmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('selection.changed', { newSelection: [ noopElement ] });

      // then
      expect(updateSpy).to.have.been.calledWith({
        element: noopElement
      });
    });


    it('should update on element changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createDmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('elements.changed', { elements: [ noopElement ] });

      // then
      expect(updateSpy).to.have.been.calledWith({
        element: noopElement
      });
    });


    it('should update on providers changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createDmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('propertiesPanel.providersChanged');

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should not update on implicit root added',function() {

      // given
      var updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      createDmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('root.added', {
        element: {
          id: '__implicitroot',
          isImplicit: true
        }
      });

      // expect
      expect(updateSpy).to.not.have.been.called;
    });


    it('should not update on implicit root selected',function() {

      // given
      var updateSpy = sinon.spy();

      const eventBus = new eventBusMock();
      const injector = new injectorMock();

      createDmnPropertiesPanel({ container, injector, eventBus });

      // when
      eventBus.fire('selection.changed', {
        oldSelectiom: {},
        newSelection: [{
          id: '__implicitroot',
          isImplicit: true
        }]
      });

      // expect
      expect(updateSpy).to.not.have.been.called;
    });


    it('should notify on layout changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.layoutChanged', updateSpy);

      // when
      createDmnPropertiesPanel({ container, eventBus });

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should notify on description loaded', function() {

      // given
      const loadedSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.descriptionLoaded', loadedSpy);

      // when
      createDmnPropertiesPanel({ container, eventBus });

      // then
      expect(loadedSpy).to.have.been.calledOnce;
    });


    it('should notify on properties panel changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createDmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('propertiesPanel.providersChanged');

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should not update deleted element', async function() {

      // given
      const element = {
        ...noopElement,
        id: 'B',
        type: 'foo:Deleted'
      };

      let elements = [
        element,
        noopElement,
        noopElement
      ];

      const elementRegistry = new elementRegistryMock();
      elementRegistry.setElements(elements);

      const updateSpy = sinon.spy();
      const eventBus = new eventBusMock();
      eventBus.on('propertiesPanel.updated', updateSpy);

      createDmnPropertiesPanel({
        container,
        element,
        elementRegistry,
        eventBus
      });

      // when --> remove the currently selected element
      elements.splice(0, 1);
      elementRegistry.setElements(elements);

      eventBus.fire('elements.changed', { elements: [ element ] });

      // then
      expect(updateSpy).to.not.have.been.called;
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