import {
  act,
  cleanup
} from '@testing-library/preact';

import TestContainer from 'mocha-test-container-support';

import {
  bootstrapPropertiesPanel,
  inject,
  changeInput
} from 'test/TestHelper';

import {
  query as domQuery
} from 'min-dom';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import DmnPropertiesPanel from 'src/render';

import DmnPropertiesProvider from 'src/provider/dmn';

import diagramXML from './DocumentationProps.dmn';


describe('provider/dmn - DocumentationProps', function() {

  const testModules = [
    DmnPropertiesPanel,
    DmnPropertiesProvider
  ];

  let container;

  afterEach(function() { return cleanup(); });

  beforeEach(bootstrapPropertiesPanel(diagramXML, {
    drd: {
      additionalModules: testModules,
      debounceInput: false
    }
  }));

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  describe('description', function() {

    const property = 'description';

    for (const elementId of [
      'Decision',
      'InformationRequirement',
      'Input',
      'TextAnnotation',
      'Association'
    ]) {

      it(`should display (${elementId})`, inject(async function(elementRegistry, selection) {

        // given
        const element = elementRegistry.get(elementId);

        await act(() => {
          selection.select(element);
        });

        // when
        const input = domQuery(`textarea[name=${property}]`, container);

        // then
        expect(input.value).to.eql(getBusinessObject(element).get(property));
      }));


      it(`should update (${elementId})`, inject(async function(elementRegistry, selection) {

        // given
        const element = elementRegistry.get(elementId);

        await act(() => {
          selection.select(element);
        });

        // when
        const nameInput = domQuery(`textarea[name=${property}]`, container);
        changeInput(nameInput, 'newValue');

        // then
        expect(getBusinessObject(element).get(property)).to.eql('newValue');
      }));


      it(`should update on external change (${elementId})`,
        inject(async function(elementRegistry, selection, commandStack) {

          // given
          const element = elementRegistry.get(elementId);
          const originalValue = getBusinessObject(element).get(property);

          await act(() => {
            selection.select(element);
          });
          const nameInput = domQuery(`textarea[name=${property}]`, container);
          changeInput(nameInput, 'newValue');

          // when
          await act(() => {
            commandStack.undo();
          });

          // then
          expect(nameInput.value).to.eql(originalValue);
        })
      );
    }
  });


  describe('question', function() {

    const property = 'question',
          elementId = 'Decision';

    it('should display', inject(async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get(elementId);

      await act(() => {
        selection.select(element);
      });

      // when
      const input = domQuery(`textarea[name=${property}]`, container);

      // then
      expect(input.value).to.eql(getBusinessObject(element).get(property));
    }));


    it('should NOT display', inject(async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get('Input');

      await act(() => {
        selection.select(element);
      });

      // when
      const input = domQuery(`textarea[name=${property}]`, container);

      // then
      expect(input).to.not.exist;
    }));


    it('should update', inject(async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get(elementId);

      await act(() => {
        selection.select(element);
      });

      // when
      const nameInput = domQuery(`textarea[name=${property}]`, container);
      changeInput(nameInput, 'newValue');

      // then
      expect(getBusinessObject(element).get(property)).to.eql('newValue');
    }));


    it('should update on external change',
      inject(async function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get(elementId);
        const originalValue = getBusinessObject(element).get(property);

        await act(() => {
          selection.select(element);
        });
        const nameInput = domQuery(`textarea[name=${property}]`, container);
        changeInput(nameInput, 'newValue');

        // when
        await act(() => {
          commandStack.undo();
        });

        // then
        expect(nameInput.value).to.eql(originalValue);
      })
    );
  });


  describe('allowedAnswers', function() {

    const property = 'allowedAnswers',
          elementId = 'Decision';

    it('should display', inject(async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get(elementId);

      await act(() => {
        selection.select(element);
      });

      // when
      const input = domQuery(`textarea[name=${property}]`, container);

      // then
      expect(input.value).to.eql(getBusinessObject(element).get(property));
    }));


    it('should NOT display', inject(async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get('Input');

      await act(() => {
        selection.select(element);
      });

      // when
      const input = domQuery(`textarea[name=${property}]`, container);

      // then
      expect(input).to.not.exist;
    }));


    it('should update', inject(async function(elementRegistry, selection) {

      // given
      const element = elementRegistry.get(elementId);

      await act(() => {
        selection.select(element);
      });

      // when
      const nameInput = domQuery(`textarea[name=${property}]`, container);
      changeInput(nameInput, 'newValue');

      // then
      expect(getBusinessObject(element).get(property)).to.eql('newValue');
    }));


    it('should update on external change',
      inject(async function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get(elementId);
        const originalValue = getBusinessObject(element).get(property);

        await act(() => {
          selection.select(element);
        });
        const nameInput = domQuery(`textarea[name=${property}]`, container);
        changeInput(nameInput, 'newValue');

        // when
        await act(() => {
          commandStack.undo();
        });

        // then
        expect(nameInput.value).to.eql(originalValue);
      })
    );
  });
});

