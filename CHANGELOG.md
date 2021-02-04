# Changelog

All notable changes to [dmn-js-properties-panel](https://github.com/bpmn-io/dmn-js-properties-panel) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

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
