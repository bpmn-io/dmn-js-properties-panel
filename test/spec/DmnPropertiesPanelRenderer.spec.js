import TestContainer from 'mocha-test-container-support';

import {
  act,
  cleanup
} from '@testing-library/preact/pure';

import {
  insertCoreStyles,
  insertDmnStyles,
  clearDmnJS,
  setDmnJS,
  inject
} from 'test/TestHelper';

import {
  createKeyEvent
} from 'test/util/KeyEvents';

import {
  query as domQuery,
  domify
} from 'min-dom';

import DmnPropertiesPanel from 'src/render';
import DmnPropertiesProvider from 'src/provider/dmn';
import DmnModeler from 'dmn-js/lib/Modeler';
import CamundaModdle from 'camunda-dmn-moddle/resources/camunda';

import CamundaPropertiesProvider from 'src/provider/camunda';


const singleStart = window.__env__ && window.__env__.SINGLE_START;

insertCoreStyles();
insertDmnStyles();


describe('<DmnPropertiesPanelRenderer>', function() {

  let modelerContainer;

  let propertiesContainer;

  let container;

  const diagramXml = require('test/fixtures/simple.dmn');

  afterEach(() => cleanup());

  beforeEach(function() {
    container = TestContainer.get(this);

    modelerContainer = document.createElement('div');
    modelerContainer.classList.add('modeler-container');

    propertiesContainer = document.createElement('div');
    propertiesContainer.classList.add('properties-container');

    container.appendChild(modelerContainer);
    container.appendChild(propertiesContainer);
  });

  async function createModeler(xml, options = {}) {

    clearDmnJS();

    const {
      shouldImport = true,
      common,
      ...restOptions
    } = options;

    const modeler = new DmnModeler({
      container: modelerContainer,
      drd: {
        additionalModules: [
          DmnPropertiesPanel,
          DmnPropertiesProvider
        ]
      },
      common:{
        propertiesPanel: {
          parent: propertiesContainer
        },
        ...common
      },
      ...restOptions
    });

    setDmnJS(modeler);

    if (!shouldImport) {
      return { modeler };
    }

    try {
      const result = await modeler.importXML(xml);

      return { error: null, warnings: result.warnings, modeler: modeler };
    } catch (err) {
      return { error: err, warnings: err.warnings, modeler: modeler };
    }
  }

  (singleStart === 'dmn' ? it.only : it)('should import simple process (dmn)', async function() {

    // when
    const result = await createModeler(diagramXml);

    // then
    expect(result.error).not.to.exist;

  });


  (singleStart === 'platform' ? it.only : it)('should import simple process (platform)', async function() {

    // when
    const result = await createModeler(diagramXml,{
      drd:{
        additionalModules: [
          DmnPropertiesPanel,
          DmnPropertiesProvider,
          CamundaPropertiesProvider
        ],
        moddleExtensions: {
          camunda: CamundaModdle
        },
      }
    });

    // then
    expect(result.error).not.to.exist;

  });


  it('should attach on diagram.init', async function() {

    // when
    await createModeler(diagramXml);

    // then
    expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.exist;
  });


  describe('detachment', function() {

    it('should detach on diagram.destroy', async function() {

      // given
      const { modeler } = await createModeler(diagramXml);
      const eventBus = get(modeler, 'eventBus');

      // assume
      expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.exist;

      // when
      eventBus.fire('diagram.destroy');

      // then
      expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.not.exist;
    });


    it('should detach when view switched to decision table via modeler.open', async function() {

      // given
      const { modeler } = await createModeler(diagramXml);
      const decisionTableView = modeler.getViews().find(view => view.type === 'decisionTable');

      // assume
      expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.exist;

      // when
      await modeler.open(decisionTableView);

      // then
      expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.not.exist;
    });


    it('should detach when modeler is detached', async function() {

      // given
      const { modeler } = await createModeler(diagramXml);

      // assume
      expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.exist;

      // when
      modeler.detach();

      // then
      expect(domQuery('.bio-properties-panel-container', propertiesContainer)).to.not.exist;
    });

  });


  describe('keyboard bindings (undo/redo)', function() {

    it('should bind', async function() {
      const diagramXml = require('test/fixtures/simple.dmn');

      const keyboardTarget = document.createElement('div');

      const { modeler } = await createModeler(diagramXml, {
        common: {
          keyboard: {
            bindTo: keyboardTarget
          }
        }
      });

      modeler.getActiveViewer().invoke(function(eventBus, elementRegistry, modeling) {

        // given
        modeling.updateLabel(elementRegistry.get('dish-decision'), 'FOOBAR');

        const executeSpy = sinon.spy();
        const undoSpy = sinon.spy();

        eventBus.on('commandStack.execute', executeSpy);
        eventBus.on('commandStack.reverted', undoSpy);

        const panelParent = domQuery('.bio-properties-panel-container', propertiesContainer);

        // when
        panelParent.dispatchEvent(createKeyEvent('z', {
          ctrlKey: true
        }));

        // then
        // undo got executed
        expect(undoSpy).to.have.been.called;

        // but when
        panelParent.dispatchEvent(createKeyEvent('y', {
          ctrlKey: true
        }));

        // then
        // redo got executed
        expect(executeSpy).to.have.been.called;
      });

    });


    it('should NOT bind with keyboard binding deactivated', async function() {
      const diagramXml = require('test/fixtures/simple.dmn');

      const { modeler } = await createModeler(diagramXml, {
        common: {
          keyboard: {
            bind: false
          }
        }
      });

      modeler.getActiveViewer().invoke(function(eventBus, elementRegistry, modeling) {

        // given
        modeling.updateLabel(elementRegistry.get('dish-decision'), 'FOOBAR');

        const executeSpy = sinon.spy();
        const undoSpy = sinon.spy();

        eventBus.on('commandStack.execute', executeSpy);
        eventBus.on('commandStack.reverted', undoSpy);

        const panelParent = domQuery('.bio-properties-panel-container', propertiesContainer);

        // when
        panelParent.dispatchEvent(createKeyEvent('z', {
          ctrlKey: true
        }));

        // then
        // undo got executed
        expect(undoSpy).not.to.have.been.called;

        // but when
        panelParent.dispatchEvent(createKeyEvent('y', {
          ctrlKey: true
        }));

        // then
        // redo got executed
        expect(executeSpy).not.to.have.been.called;
      });

    });

  });


  describe('providers', function() {

    beforeEach(async function() {
      await createModeler(diagramXml);
    });


    it('should ignore incompatible provider', inject(function(propertiesPanel) {

      // assume
      expect(propertiesPanel._getProviders()).to.have.length(1);

      // given
      const incompatibleProvider = {
        getTabs: function() {
          return [];
        }
      };

      // when
      propertiesPanel.registerProvider(incompatibleProvider);

      // then
      // incompatible provider was not added
      expect(propertiesPanel._getProviders()).to.have.length(1);
    }));

  });


  describe('integration', function() {

    it('should ensure creating + importing -> attaching works', async function() {

      // given
      const { modeler } = await createModeler(diagramXml, {
        common: {
          propertiesPanel: {}
        }
      });

      // assume
      expect(domQuery('.bio-properties-panel', propertiesContainer)).to.not.exist;

      // when
      const propertiesPanel = get(modeler, 'propertiesPanel');
      propertiesPanel.attachTo(propertiesContainer);

      // then
      expect(domQuery('.bio-properties-panel', propertiesContainer)).to.exist;
    });


    it('should ensure creating + attaching -> importing works', async function() {

      // given
      const { modeler } = await createModeler(null, {
        shouldImport: false,
        common: {
          propertiesPanel: {
            parent: propertiesContainer
          }
        }
      });

      // assume
      expect(domQuery('.bio-properties-panel', propertiesContainer)).to.not.exist;

      // when
      await modeler.importXML(diagramXml);

      // then
      expect(domQuery('.bio-properties-panel', propertiesContainer)).to.exist;
    });


    it('should ensure creating -> attaching -> import works', async function() {

      // given
      const { modeler } = await createModeler(diagramXml, {
        common:{
          propertiesPanel: {}
        }
      });

      const propertiesPanel = get(modeler, 'propertiesPanel');
      expect(domQuery('.bio-properties-panel', propertiesContainer)).to.not.exist;

      // when
      propertiesPanel.attachTo(propertiesContainer);

      // then
      expect(domQuery('.bio-properties-panel', propertiesContainer)).to.exist;
    });
  });


  describe('header name', function() {

    beforeEach(async function() {
      await createModeler(diagramXml);
    });


    it('should keep state during detach and attach', inject(async function(elementRegistry, selection, propertiesPanel) {

      // given
      await act(() => selection.select(elementRegistry.get('dish-decision')));

      // assume
      expect(getHeaderName(propertiesContainer)).to.eql('Dish Decision');

      // when
      propertiesPanel.detach();
      propertiesPanel.attachTo(propertiesContainer);

      // then
      expect(getHeaderName(propertiesContainer)).to.eql('Dish Decision');
    }));

  });


  it('#attachTo', async function() {

    // given
    const container = domify('<div></div>');
    TestContainer.get(this).appendChild(container);

    const { modeler } = await createModeler(diagramXml, {
      common:{
        propertiesPanel: {}
      }
    });

    const propertiesPanel = get(modeler, 'propertiesPanel');

    // when
    propertiesPanel.attachTo(container);

    // then
    expect(domQuery('.bio-properties-panel', container)).to.exist;
  });


  it('#detach', async function() {

    // given
    const container = domify('<div></div>');
    TestContainer.get(this).appendChild(container);

    // when
    const { modeler } = await createModeler(diagramXml, {
      common:{
        propertiesPanel: {}
      }
    });

    const propertiesPanel = get(modeler, 'propertiesPanel');

    propertiesPanel.attachTo(container);

    // when
    propertiesPanel.detach();

    // then
    expect(domQuery('.bio-properties-panel', container)).to.not.exist;
  });


  describe('event emitting', function() {

    it('should emit <propertiesPanel.attach>', async function() {

      // given
      const spy = sinon.spy();

      const container = domify('<div></div>');
      TestContainer.get(this).appendChild(container);

      const { modeler } = await createModeler(diagramXml);

      const eventBus = get(modeler, 'eventBus');
      const propertiesPanel = get(modeler, 'propertiesPanel');

      eventBus.on('propertiesPanel.attach', spy);

      // when
      propertiesPanel.attachTo(container);

      // then
      expect(spy).to.have.been.calledOnce;
    });


    it('should emit <propertiesPanel.detach>', async function() {

      // given
      const spy = sinon.spy();

      const { modeler } = await createModeler(diagramXml);

      const eventBus = get(modeler, 'eventBus');
      const propertiesPanel = get(modeler, 'propertiesPanel');

      eventBus.on('propertiesPanel.detach', spy);

      // when
      propertiesPanel.detach();

      // then
      expect(spy).to.have.been.calledOnce;
    });


    it('should emit <propertiesPanel.rendered>', async function() {

      // given
      const spy = sinon.spy();

      const { modeler } = await createModeler(diagramXml);

      const eventBus = get(modeler, 'eventBus');
      const propertiesPanel = get(modeler, 'propertiesPanel');

      eventBus.on('propertiesPanel.rendered', spy);

      // when
      propertiesPanel._render();

      // then
      expect(spy).to.have.been.calledOnce;
    });


    it('should NOT emit <propertiesPanel.rendered> on attach', async function() {

      // given
      const spy = sinon.spy();

      const container = domify('<div></div>');
      TestContainer.get(this).appendChild(container);

      const { modeler } = await createModeler(diagramXml);

      const eventBus = get(modeler, 'eventBus');
      const propertiesPanel = get(modeler, 'propertiesPanel');

      eventBus.on('propertiesPanel.rendered', spy);

      // when
      propertiesPanel.attachTo(container);

      // then
      expect(spy).to.not.have.been.called;
    });


    it('should emit <propertiesPanel.destroyed>', async function() {

      // given
      const spy = sinon.spy();

      const { modeler } = await createModeler(diagramXml);

      const eventBus = get(modeler, 'eventBus');
      const propertiesPanel = get(modeler, 'propertiesPanel');

      eventBus.on('propertiesPanel.destroyed', spy);

      // when
      propertiesPanel._destroy();

      // then
      expect(spy).to.have.been.calledOnce;
    });

  });


  describe('<feelPopup> support', function() {

    let modeler;

    beforeEach(async function() {

      await act(async () => {

        const result = await createModeler(diagramXml, {
          propertiesPanel: {
            parent: propertiesContainer,
            feelPopupContainer: container
          }
        });

        modeler = result.modeler;
      });

      await act(() => {
        const elementRegistry = get(modeler, 'elementRegistry');
        const selection = get(modeler, 'selection');

        selection.select(elementRegistry.get('guestCount'));
      });
    });


    it('should ship <feelPopup>', async function() {

      // when
      const feelPopup = get(modeler, 'feelPopup');

      // then
      expect(feelPopup).to.exist;

      expect(feelPopup.isOpen()).to.be.false;

      expect(() => {
        feelPopup.close();
      }).not.to.throw;
    });

  });

});


//  helper

function get(modeler, module) {
  return modeler.getActiveViewer().get(module);
}

function getHeaderName(container) {
  return domQuery('.bio-properties-panel-header-label', container).innerText;
}