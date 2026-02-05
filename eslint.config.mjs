import bpmnIoPlugin from 'eslint-plugin-bpmn-io';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

const files = {
  build: [
    '*.js',
    '*.mjs',
    'test/distro/distroSpec.js'
  ],
  test: [
    'test/**/*.js'
  ],
  ignored: [
    'dist'
  ]
};

export default [
  {
    ignores: files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {
    return {
      ...config,
      files: files.build
    };
  }),
  {
    languageOptions: {
      ecmaVersion: 2025
    },
    files: files.build
  },

  // lib + test
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      ignores: files.build
    };
  }),
  ...bpmnIoPlugin.configs.jsx.map(config => {
    return {
      ...config,
      ignores: files.build
    };
  }),
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
      import: importPlugin
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'import/first': 'error',
      'import/no-amd': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'react-hooks/exhaustive-deps': 'off'
    },
    ignores: files.build
  },

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: files.test
    };
  }),
  {
    languageOptions: {
      globals: {
        require: true
      },
    },
    files: files.test
  }
];
