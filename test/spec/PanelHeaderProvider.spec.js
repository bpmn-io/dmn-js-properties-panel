import {
  render
} from '@testing-library/preact/pure';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery
} from 'min-dom';

import DmnModdle from 'dmn-moddle';

import {
  insertCoreStyles
} from 'test/TestHelper';

import { Header } from '@bpmn-io/properties-panel';

import {
  PanelHeaderProvider,
  getConcreteType
} from 'src/render/PanelHeaderProvider';

insertCoreStyles();

const noop = () => {};

const noopElement = {
  id: 'foo',
  type: 'foo:bar',
  businessObject: {
    get: noop
  }
};

const dmnModdle = new DmnModdle();


describe('<PanelHeaderProvider>', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  describe('rendering', function() {

    it('should render inside header', function() {

      // when
      const result = createHeader({ container });

      const headerNode = domQuery('.bio-properties-panel-header', result.container);

      // then
      expect(headerNode).to.exist;
    });


    it('should render with icon', function() {

      // given
      const element = createElement('dmn:Decision');

      // when
      const result = createHeader({ container, element });

      const iconNode = domQuery('.bio-properties-panel-header-icon', result.container);

      // then
      expect(iconNode).to.exist;
    });


    it('should render with label', function() {

      // given
      const element = createElement('dmn:Decision', {
        name: 'name'
      });

      // when
      const result = createHeader({ container, element });

      const labelNode = domQuery('.bio-properties-panel-header-label', result.container);

      // then
      expect(labelNode).to.exist;
      expect(labelNode.innerText).to.equal('name');
    });


    it('should render with type', function() {

      // given
      const element = createElement('dmn:Decision');

      // when
      const result = createHeader({ container, element });

      const typeNode = domQuery('.bio-properties-panel-header-type', result.container);

      // then
      expect(typeNode).to.exist;
      expect(typeNode.innerText).to.equal('DECISION');
    });

  });


  describe('#getElementLabel', function() {

    it('should get label - name', function() {

      // given
      const element = createElement('dmn:KnowledgeSource', {
        name: 'foo'
      });

      // when
      const elementLabel = PanelHeaderProvider.getElementLabel(element);

      // then
      expect(elementLabel).to.equal('foo');
    });


    it('should get label - text', function() {

      // given
      const element = createElement('dmn:TextAnnotation', {
        text: 'foo'
      });

      // when
      const elementLabel = PanelHeaderProvider.getElementLabel(element);

      // then
      expect(elementLabel).to.equal('foo');
    });

  });


  describe('#getConcreteType', function() {

    it('should get type - decision', async function() {

      // given
      const element = createElement('dmn:Decision');

      // when
      const type = getConcreteType(element);

      // then
      expect(type).to.equal('Decision');
    });


    it('should get type - knowledge source', async function() {

      // given
      const element = createElement('dmn:KnowledgeSource');

      // when
      const type = getConcreteType(element);

      // then
      expect(type).to.equal('KnowledgeSource');
    });


    it('should get type - business knowledge model', async function() {

      // given
      const element = createElement('dmn:BusinessKnowledgeModel');

      // when
      const type = getConcreteType(element);

      // then
      expect(type).to.equal('BusinessKnowledgeModel');
    });


    it('should get type - input data', async function() {

      // given
      const element = createElement('dmn:InputData');

      // when
      const type = getConcreteType(element);

      // then
      expect(type).to.equal('InputData');
    });


    it('should get type - information requirement', async function() {

      // given
      const sequenceFlow = createElement('dmn:InformationRequirement');

      // when
      const type = getConcreteType(sequenceFlow);

      // then
      expect(type).to.equal('InformationRequirement');
    });


    it('should get type - authority requirement', async function() {

      // given
      const sequenceFlow = createElement('dmn:AuthorityRequirement');

      // when
      const type = getConcreteType(sequenceFlow);

      // then
      expect(type).to.equal('AuthorityRequirement');
    });


    it('should get type - knowledge requirement', async function() {

      // given
      const sequenceFlow = createElement('dmn:KnowledgeRequirement');

      // when
      const type = getConcreteType(sequenceFlow);

      // then
      expect(type).to.equal('KnowledgeRequirement');
    });

  });

});


// helpers //////////////////////////

function createHeader(options = {}) {
  const {
    element = noopElement,
    headerProvider = PanelHeaderProvider,
    container
  } = options;

  return render(
    <Header
      element={ element }
      headerProvider={ headerProvider } />,
    {
      container
    }
  );
}

function createElement(type, attrs) {

  const businessObject = dmnModdle.create(type, attrs);

  const element = {
    type,
    businessObject
  };

  return element;
}