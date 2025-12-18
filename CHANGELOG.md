# Changelog

All notable changes to [dmn-js-properties-panel](https://github.com/bpmn-io/dmn-js-properties-panel) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 3.9.0

* `FEAT`: save values on blur
* `DEPS`: update to `dmn-js*@17.5.0`
* `DEPS`: update to `@bpmn-io/properties-panel@3.35.0`

## 3.8.3

* `FIX`: update on `import.done` instead of `root.added` to prevent stale element ([#128](https://github.com/bpmn-io/dmn-js-properties-panel/pull/128))

## 3.8.2

* `FIX`: reverts keeping selected element in sync with canvas state ([#122](https://github.com/bpmn-io/dmn-js-properties-panel/pull/122))

## 3.8.1

* `FIX`: manage state outside of preact to avoid updates with stale element

## 3.8.0

* `FEAT`: trim whitespace in text inputs ([bpmn-io/properties-panel#404](https://github.com/bpmn-io/properties-panel/issues/404), [bpmn-io/properties-panel#309](https://github.com/bpmn-io/properties-panel/issues/309))
* `FIX`: make tooltip persist when trying to copy from it ([bpmn-io/properties-panel#399](https://github.com/bpmn-io/properties-panel/pull/399))
* `FIX`: remove input border from popups ([bpmn-io/properties-panel#398](https://github.com/bpmn-io/properties-panel/pull/398))
* `DEPS`: update to `@bpmn-io/properties-panel@3.23.2`

## 3.7.0

* `FEAT`: make properties panel focusable ([#108](https://github.com/bpmn-io/dmn-js-properties-panel/pull/108))

## 3.6.0

* `CHORE`: turn `diagram-js` into peer dependency

## 3.5.2

* `FIX`: fix name of Zeebe provider ([`7482ac8b`](https://github.com/bpmn-io/dmn-js-properties-panel/commit/7482ac8b6b5b6a02e1a7879cf52d85f944076424))

## 3.5.1

* `CHORE`: export Zeebe provider ([`e53271bc`](https://github.com/bpmn-io/dmn-js-properties-panel/commit/e53271bc154b7dd79249a0fb0dffcebdbbe96765))

## 3.5.0

* `FEAT`: add _Version tag_ field for decisions ([#97](https://github.com/bpmn-io/dmn-js-properties-panel/issues/97))

## 3.4.1

* `FIX`: make name field a text area ([#94](https://github.com/bpmn-io/dmn-js-properties-panel/issues/94))

## 3.4.0

* `DEPS`: update to `@bpmn-io/properties-panel@3.22.0`

## 3.3.2

* `FIX`: keep missing ID error in plain DMN ([#85](https://github.com/bpmn-io/dmn-js-properties-panel/issues/85))

## 3.3.1

* `FIX`: keep missing ID error ([#85](https://github.com/bpmn-io/dmn-js-properties-panel/issues/85))

## 3.3.0

* `FEAT`: add `HTTL` hint ([#82](https://github.com/bpmn-io/dmn-js-properties-panel/pull/82))

## 3.2.1

* `FIX`: provide correct styles file ([#65](https://github.com/bpmn-io/dmn-js-properties-panel/issues/65))

## 3.2.0

* `FEAT`: support documentation fields ([#62](https://github.com/bpmn-io/dmn-js-properties-panel/issues/62))

## 3.1.0

* `DEPS`: update to `@bpmn-io/properties-panel@3.7`

## 3.0.0

* `DEPS`: update to `@bpmn-io/properties-panel@3`
* `DEPS`: update to `diagram-js@12.2.0`

## 2.0.0

* `FEAT`: do not handle properties panel open state
* `DEPS`: update to `@bpmn-io/properties-panel@2`
* `DEPS`: update to `diagram-js@12`

### Breaking Changes

* Properties panel open state is no longer controlled by properties panel.

## 1.3.2

* `DEPS`: update dependencies

## 1.3.1

* `DEPS`: support `dmn-js@14`

## 1.3.0

* `FEAT`: support JQuery wrapper as parent element
* `DEPS`: update to `diagram-js@11`
* `DEPS`: require `@bpmn-io/properties-panel@1`

## 1.2.2

* `DEPS`: support `@bpmn-io/properties-panel@0.24.0`
* `CHORE`: relax peer dependency requirements

## 1.2.1

* `DEPS`: support `@bpmn-io/properties-panel@0.23.0`

## 1.2.0

* `DEPS`: support `dmn-js@13`
* `DEPS`: support `@bpmn-io/properties-panel@0.22.0`

## 1.1.2

* `DEPS`: update to `@bpmn-io/properties-panel@0.20.1` ([changelog](https://github.com/bpmn-io/properties-panel/blob/main/CHANGELOG.md#0201))

## 1.1.1

* `DEPS`: update to `dmn-js@12.3.0` ([changelog](https://github.com/bpmn-io/dmn-js/blob/develop/packages/dmn-js/CHANGELOG.md#1230))
* `DEPS`: update to `@bpmn-io/properties-panel@0.19.0` ([changelog](https://github.com/bpmn-io/properties-panel/blob/main/CHANGELOG.md#0190))

## 1.1.0

* `FEAT`: add multi state + empty placeholders ([#42](https://github.com/bpmn-io/dmn-js-properties-panel/pull/42))
* `DEPS`: update to `@bpmn-io/properties-panel@0.15.0` ([changelog](https://github.com/bpmn-io/properties-panel/blob/main/CHANGELOG.md#0150))

## 1.0.0

* `FEAT`: rewrite project to new, [@bpmn-io/properties-panel](https://github.com/bpmn-io/properties-panel)-based architecture
* `FEAT`: replace tabs with flat structure where groups are basic building blocks
* `FEAT`: add "dirty" markers to notify non-default value of entry/entries in group
* `FEAT`: keep open/closed state of the groups between elements

### Breaking Changes

* `PropertiesProvider#getTabs` is no longer used. Migrate to the new `PropertiesProvider#getGroups` API instead.
  Check out [the example migration](https://github.com/bpmn-io/bpmn-js-examples/pull/142) for guidance.
* Previously exported entry factory functions are no longer available. Use components exported from
  [`@bpmn-io/properties-panel`](https://github.com/bpmn-io/properties-panel) instead.
* Adapters have been removed. The properties panel is now available only for DRD viewer.

## 0.7.0

* `FEAT`: incorporate reduced color palette ([#27](https://github.com/bpmn-io/dmn-js-properties-panel/issues/27))
* `FEAT`: inherit font family in inputs ([#25](https://github.com/bpmn-io/dmn-js-properties-panel/pull/25))
* `FIX`: don't use browser defaults for undo+redo ([#24](https://github.com/bpmn-io/dmn-js-properties-panel/pull/24))
* `DEPS`: update to `diagram-js@7.8.2`
* `DEPS`: update to `dmn-js@11.1.2`

## 0.6.2

* `DEPS`: update to `diagram-js@7.4.0` ([#22](https://github.com/bpmn-io/dmn-js-properties-panel/pull/22))

## 0.6.1

* `FIX`: preserve Windows newline characters ([#21](https://github.com/bpmn-io/dmn-js-properties-panel/pull/21))
* `DEPS`: update dev dependencies

## 0.6.0

* `CHORE`: bump to `eslint-plugin-bpmn-io@0.12.0`
* `CHORE`: bump to `dmn-js@10.1.0-alpha.2`
* `CHORE`: bump to `diagram-js@7.2.0`
* `CHORE`: bump to `camunda-dmn-moddle@1.1.0`

### Breaking Changes

* Dropped IE 11 support with `dmn-js@9.0.0`. Migrate to modern browsers or use <=0.5 version.

## 0.5.0

* `FEAT`: align with Camunda Modeler colors ([#18](https://github.com/bpmn-io/dmn-js-properties-panel/pull/18))

## 0.4.0

* `FEAT`: show ID props for any element ([#14](https://github.com/bpmn-io/dmn-js-properties-panel/pull/14))
* `CHORE`: bump to [`dmn-js@8.2.0`](https://github.com/bpmn-io/dmn-js)

## 0.3.5

* `FIX`: paste always as plain text ([#15](https://github.com/bpmn-io/dmn-js-properties-panel/pull/15))

## 0.3.4

* `FIX`: Do not allow placeholders in IDs ([#13](https://github.com/bpmn-io/dmn-js-properties-panel/pull/13))

## 0.3.3

* `CHORE`: mark as `dmn-js@7` compatible

## 0.3.1

* `FIX`: Support line breaks in Entry Field Description ([#12](https://github.com/bpmn-io/dmn-js-properties-panel/pull/12))

## 0.3.0

* `FEAT`: sanitize entities when building HTML ([#9](https://github.com/bpmn-io/dmn-js-properties-panel/issues/9))
* `FEAT`: add hint about decision definition key
* `FIX`: remove accidentially added whitespace
* `FEAT`: translate error messages

## 0.2.0

* `CHORE`: mark as compatible with `dmn-js@6`
* `FIX`: don't restrict properties panel height unnecessarily ([#5](https://github.com/bpmn-io/dmn-js-properties-panel/issues/5))

## 0.1.2

* `FIX`: properly namespace font to `dmn-js-pp`

## 0.1.1

* `FIX`: use `lodash` in a way that allows tree-shaking ([#2](https://github.com/bpmn-io/dmn-js-properties-panel/issues/2))

## 0.1.0

__Initial version.__

* `FEAT`: edit basic `Definitions` and `Decision` attributes
* `FEAT`: edit Camunda properties [`73d31241`](https://github.com/bpmn-io/dmn-js-properties-panel/commit/73d3124183dcd8ee0d6dca8ee52ccbf10e0e828a)
