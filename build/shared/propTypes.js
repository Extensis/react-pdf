'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkServiceProp = exports.rotateProp = exports.pageProp = exports.pdfProp = exports.eventsProps = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.once');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('./events');

var _LinkService = require('../LinkService');

var _LinkService2 = _interopRequireDefault(_LinkService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventsProps = exports.eventsProps = (0, _lodash2.default)(function () {
  var eventProps = {};

  [].concat(_events.mouseEvents, _events.touchEvents).forEach(function (eventName) {
    eventProps[eventName] = _propTypes2.default.func;
  });

  return eventProps;
});

var pdfProp = exports.pdfProp = _propTypes2.default.shape({
  getDestination: _propTypes2.default.func.isRequired,
  getOutline: _propTypes2.default.func.isRequired,
  getPage: _propTypes2.default.func.isRequired,
  numPages: _propTypes2.default.number.isRequired
});

var pageProp = exports.pageProp = _propTypes2.default.shape({
  commonObjs: _propTypes2.default.shape({
    objs: _propTypes2.default.object.isRequired
  }).isRequired,
  getAnnotations: _propTypes2.default.func.isRequired,
  getTextContent: _propTypes2.default.func.isRequired,
  getViewport: _propTypes2.default.func.isRequired,
  render: _propTypes2.default.func.isRequired,
  transport: _propTypes2.default.shape({
    fontLoader: _propTypes2.default.object.isRequired
  }).isRequired
});

var rotateProp = exports.rotateProp = _propTypes2.default.oneOf([0, 90, 180, 270]);

var linkServiceProp = exports.linkServiceProp = _propTypes2.default.instanceOf(_LinkService2.default);