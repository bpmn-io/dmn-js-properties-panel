# Changelog

All notable changes to [dmn-js-properties-panel](https://github.com/bpmn-io/dmn-js-properties-panel) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

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
