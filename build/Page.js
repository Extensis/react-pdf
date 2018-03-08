'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mergeClassNames = require('merge-class-names');

var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);

var _PageCanvas = require('./PageCanvas');

var _PageCanvas2 = _interopRequireDefault(_PageCanvas);

var _PageSVG = require('./PageSVG');

var _PageSVG2 = _interopRequireDefault(_PageSVG);

var _PageTextContent = require('./PageTextContent');

var _PageTextContent2 = _interopRequireDefault(_PageTextContent);

var _PageAnnotations = require('./PageAnnotations');

var _PageAnnotations2 = _interopRequireDefault(_PageAnnotations);

var _util = require('./shared/util');

var _events = require('./shared/events');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Page = function (_Component) {
  (0, _inherits3.default)(Page, _Component);

  function Page() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Page);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Page.__proto__ || (0, _getPrototypeOf2.default)(Page)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      page: null
    }, _this.onLoadSuccess = function (page) {
      _this.setState({ page: page });

      var _this2 = _this,
          pageCallback = _this2.pageCallback;


      (0, _util.callIfDefined)(_this.props.onLoadSuccess, pageCallback);

      (0, _util.callIfDefined)(_this.props.registerPage, page.pageIndex, _this.ref);
    }, _this.onLoadError = function (error) {
      if ((error.message || error) === 'cancelled') {
        return;
      }

      (0, _util.errorOnDev)(error.message, error);

      (0, _util.callIfDefined)(_this.props.onLoadError, error);

      _this.setState({ page: false });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Page, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadPage();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.pdf !== this.props.pdf || this.getPageNumber(nextProps) !== this.getPageNumber()) {
        (0, _util.callIfDefined)(this.props.unregisterPage, this.state.page.pageIndex);

        this.loadPage(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _util.callIfDefined)(this.props.unregisterPage, this.pageIndex);

      if (this.runningTask && this.runningTask.cancel) {
        this.runningTask.cancel();
      }
    }

    /**
     * Called when a page is loaded successfully
     */


    /**
     * Called when a page failed to load
     */

  }, {
    key: 'getPageIndex',
    value: function getPageIndex() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      if ((0, _util.isProvided)(props.pageIndex)) {
        return props.pageIndex;
      }

      if ((0, _util.isProvided)(props.pageNumber)) {
        return props.pageNumber - 1;
      }

      return null;
    }
  }, {
    key: 'getPageNumber',
    value: function getPageNumber() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      if ((0, _util.isProvided)(props.pageNumber)) {
        return props.pageNumber;
      }

      if ((0, _util.isProvided)(props.pageIndex)) {
        return props.pageIndex + 1;
      }

      return null;
    }
  }, {
    key: 'loadPage',
    value: function loadPage() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var pdf = props.pdf;

      var pageNumber = this.getPageNumber(props);

      if (!pdf) {
        throw new Error('Attempted to load a page, but no document was specified.');
      }

      if (this.state.page !== null) {
        this.setState({ page: null });
      }

      this.runningTask = (0, _util.makeCancellable)(pdf.getPage(pageNumber));

      return this.runningTask.promise.then(this.onLoadSuccess).catch(this.onLoadError);
    }
  }, {
    key: 'renderTextLayer',
    value: function renderTextLayer() {
      var _props = this.props,
          highlight = _props.highlight,
          renderTextLayer = _props.renderTextLayer;


      if (!renderTextLayer) {
        return null;
      }

      var _props2 = this.props,
          onGetTextError = _props2.onGetTextError,
          onGetTextSuccess = _props2.onGetTextSuccess;
      var page = this.state.page;
      var rotate = this.rotate,
          scale = this.scale;


      return _react2.default.createElement(_PageTextContent2.default, {
        highlight: highlight,
        key: page.pageIndex + '@' + scale + '/' + rotate + '_text',
        onGetTextError: onGetTextError,
        onGetTextSuccess: onGetTextSuccess,
        page: page,
        rotate: rotate,
        scale: scale
      });
    }
  }, {
    key: 'renderAnnotations',
    value: function renderAnnotations() {
      var renderAnnotations = this.props.renderAnnotations;


      if (!renderAnnotations) {
        return null;
      }

      var linkService = this.props.linkService;
      var page = this.state.page;
      var rotate = this.rotate,
          scale = this.scale;


      return _react2.default.createElement(_PageAnnotations2.default, {
        key: page.pageIndex + '@' + scale + '/' + rotate + '_annotations',
        linkService: linkService,
        page: page,
        rotate: rotate,
        scale: scale
      });
    }
  }, {
    key: 'renderSVG',
    value: function renderSVG() {
      var _props3 = this.props,
          onRenderError = _props3.onRenderError,
          onRenderSuccess = _props3.onRenderSuccess;
      var page = this.state.page;
      var rotate = this.rotate,
          scale = this.scale;


      return [_react2.default.createElement(_PageSVG2.default, {
        key: page.pageIndex + '@' + scale + '/' + rotate + '_svg',
        onRenderError: onRenderError,
        onRenderSuccess: onRenderSuccess,
        page: page,
        rotate: this.rotate,
        scale: this.scale
      }),
      /**
       * As of now, PDF.js 2.0.120 returns warnings on unimplemented annotations.
       * Therefore, as a fallback, we render "traditional" PageAnnotations component.
       */
      this.renderAnnotations()];
    }
  }, {
    key: 'renderCanvas',
    value: function renderCanvas() {
      var _props4 = this.props,
          onRenderError = _props4.onRenderError,
          onRenderSuccess = _props4.onRenderSuccess;
      var page = this.state.page;
      var rotate = this.rotate,
          scale = this.scale;


      return [_react2.default.createElement(_PageCanvas2.default, {
        key: page.pageIndex + '@' + scale + '/' + rotate + '_canvas',
        onRenderError: onRenderError,
        onRenderSuccess: onRenderSuccess,
        page: page,
        rotate: rotate,
        scale: scale
      }), this.renderTextLayer(), this.renderAnnotations()];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var pdf = this.props.pdf;
      var page = this.state.page;
      var pageIndex = this.pageIndex;


      if (!pdf || !page) {
        return null;
      }

      if (pageIndex < 0 || pageIndex > pdf.numPages) {
        return null;
      }

      var _props5 = this.props,
          children = _props5.children,
          className = _props5.className,
          renderMode = _props5.renderMode;


      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({
          className: (0, _mergeClassNames2.default)('ReactPDF__Page', className),
          ref: function ref(_ref2) {
            var inputRef = _this3.props.inputRef;

            if (inputRef) {
              inputRef(_ref2);
            }

            _this3.ref = _ref2;
          },
          style: { position: 'relative' },
          'data-page-number': this.getPageNumber()
        }, this.eventProps),
        renderMode === 'svg' ? this.renderSVG() : this.renderCanvas(),
        children
      );
    }
  }, {
    key: 'pageIndex',
    get: function get() {
      return this.getPageIndex();
    }
  }, {
    key: 'pageNumber',
    get: function get() {
      return this.getPageNumber();
    }
  }, {
    key: 'rotate',
    get: function get() {
      var rotate = this.props.rotate;


      if ((0, _util.isProvided)(rotate)) {
        return rotate;
      }

      var page = this.state.page;


      return page.rotate;
    }
  }, {
    key: 'scale',
    get: function get() {
      var _props6 = this.props,
          scale = _props6.scale,
          width = _props6.width;
      var page = this.state.page;
      var rotate = this.rotate;

      // Be default, we'll render page at 100% * scale width.

      var pageScale = 1;

      // If width is defined, calculate the scale of the page so it could be of desired width.
      if (width) {
        var viewport = page.getViewport(scale, rotate);
        pageScale = width / viewport.width;
      }

      return scale * pageScale;
    }
  }, {
    key: 'pageCallback',
    get: function get() {
      var page = this.state.page;
      var scale = this.scale;


      return (0, _extends3.default)({}, page, {
        // Legacy callback params
        get width() {
          return page.view[2] * scale;
        },
        get height() {
          return page.view[3] * scale;
        },
        scale: scale,
        get originalWidth() {
          return page.view[2];
        },
        get originalHeight() {
          return page.view[3];
        }
      });
    }
  }, {
    key: 'eventProps',
    get: function get() {
      return (0, _events.makeEventProps)(this.props, this.pageCallback);
    }
  }]);
  return Page;
}(_react.Component);

exports.default = Page;


Page.defaultProps = {
  renderAnnotations: true,
  renderMode: 'canvas',
  renderTextLayer: true,
  scale: 1.0
};

Page.propTypes = (0, _extends3.default)({
  children: _propTypes2.default.node,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
  highlight: _propTypes2.default.shape({
    begin: _propTypes2.default.shape({
      divIdx: _propTypes2.default.number.isRequired,
      offset: _propTypes2.default.number.isRequired
    }),
    end: _propTypes2.default.shape({
      divIdx: _propTypes2.default.number.isRequired,
      offset: _propTypes2.default.number.isRequired
    })
  }),
  inputRef: _propTypes2.default.func,
  linkService: _propTypes3.linkServiceProp,
  onGetTextError: _propTypes2.default.func,
  onGetTextSuccess: _propTypes2.default.func,
  onLoadError: _propTypes2.default.func,
  onLoadSuccess: _propTypes2.default.func,
  onRenderError: _propTypes2.default.func,
  onRenderSuccess: _propTypes2.default.func,
  pageIndex: _propTypes2.default.number, // eslint-disable-line react/no-unused-prop-types
  pageNumber: _propTypes2.default.number, // eslint-disable-line react/no-unused-prop-types
  pdf: _propTypes3.pdfProp,
  registerPage: _propTypes2.default.func,
  renderAnnotations: _propTypes2.default.bool,
  renderMode: _propTypes2.default.oneOf(['canvas', 'svg']),
  renderTextLayer: _propTypes2.default.bool,
  rotate: _propTypes2.default.number,
  scale: _propTypes2.default.number,
  unregisterPage: _propTypes2.default.func,
  width: _propTypes2.default.number
}, (0, _propTypes3.eventsProps)());