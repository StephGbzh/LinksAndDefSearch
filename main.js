'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};

var idx = lunr(function () {
    var _this = this;

    this.ref('key');
    // https://lunrjs.com/docs/lunr.Builder.html#field
    Object.entries(fields).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            field = _ref2[0],
            attributes = _ref2[1];

        _this.field(field, attributes);
    });

    // remove the stemmer as it breaks some wildcard searches
    // the performance will be worse but no big deal as long as we don't have too much data
    // https://github.com/olivernn/lunr.js/issues/377#issuecomment-426380071
    // possible other workaround https://github.com/hoelzro/tw-full-text-search/issues/9
    // same pb https://github.com/olivernn/lunr.js/issues/421
    this.pipeline.remove(lunr.stemmer);
    this.searchPipeline.remove(lunr.stemmer);

    documents.forEach(function (doc, i) {
        doc["key"] = i;
        _this.add(doc);
        store[i] = doc;
    }, this);
});

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
var stringToColour = function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash *= 100;
    var colour = '#';
    for (var _i = 0; _i < 3; _i++) {
        var value = hash >> _i * 8 & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};

var Tag = function Tag(_ref3) {
    var tag = _ref3.tag,
        index = _ref3.index,
        color = _ref3.color;
    return React.createElement(
        'div',
        { 'class': 'tag', style: {
                border: "thin solid " + color,
                marginLeft: index == 0 ? "0" : "2px"
            } },
        React.createElement('span', { 'class': 'tag-dot', style: {
                backgroundColor: color
            } }),
        React.createElement(
            'span',
            { 'class': 'tag-text' },
            tag
        )
    );
};

var Result = function Result(_ref4) {
    var doc = _ref4.doc;
    return React.createElement(
        'div',
        { 'class': 'result' },
        Object.entries(fields).map(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                field = _ref6[0],
                type = _ref6[1].type;

            switch (type) {
                case "list":
                    return React.createElement(
                        'div',
                        { 'class': 'result-list' },
                        doc[field].map(function (tag, i) {
                            return React.createElement(Tag, { key: tag, tag: tag, index: i, color: stringToColour(tag) });
                        })
                    );
                case "link":
                    return React.createElement(
                        'div',
                        { 'class': 'result-link' },
                        React.createElement(
                            'a',
                            { href: doc[field], target: '_blank' },
                            doc[field]
                        )
                    );
                case "text":
                    return React.createElement(
                        'div',
                        null,
                        doc[field]
                    );
                default:
                    return React.createElement(
                        'div',
                        null,
                        'Field "',
                        field,
                        '" of unknown type: ',
                        type
                    );
            }
        })
    );
};

var MAX_RESULTS_DEFAULT = 10;

var SearchField = function (_React$Component) {
    _inherits(SearchField, _React$Component);

    function SearchField(props) {
        _classCallCheck(this, SearchField);

        var _this2 = _possibleConstructorReturn(this, (SearchField.__proto__ || Object.getPrototypeOf(SearchField)).call(this, props));

        _this2.state = {
            value: '',
            result: idx.search("*"),
            searchString: "",
            maxResults: MAX_RESULTS_DEFAULT
        };
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.handleKeyDown = _this2.handleKeyDown.bind(_this2);
        _this2.handleMoreClick = _this2.handleMoreClick.bind(_this2);
        _this2.handleClear = _this2.handleClear.bind(_this2);
        return _this2;
    }

    _createClass(SearchField, [{
        key: 'handleChange',
        value: function handleChange(event) {
            var searchString = event.target.value.trim() == "" ? "" : "+*" + event.target.value.trim().replace(/\s+/g, "* +*") + "*";

            this.setState({
                value: event.target.value,
                result: searchString == this.state.searchString ? this.state.result : searchString == "" ? idx.search("*") : idx.search(searchString),
                maxResults: MAX_RESULTS_DEFAULT,
                searchString: searchString
            });
        }
    }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(event) {
            if (event.keyCode == 27) {
                // ESC
                event.preventDefault();
                this.setState({ value: "", result: idx.search("*"), searchString: "", maxResults: MAX_RESULTS_DEFAULT });
            }
        }
    }, {
        key: 'handleMoreClick',
        value: function handleMoreClick(event) {
            event.preventDefault();
            this.setState({ maxResults: this.state.maxResults + MAX_RESULTS_DEFAULT });
        }
    }, {
        key: 'handleClear',
        value: function handleClear(event) {
            event.preventDefault();
            this.setState({ value: "", result: idx.search("*"), searchString: "", maxResults: MAX_RESULTS_DEFAULT });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { 'class': 'main' },
                React.createElement(
                    'div',
                    { 'class': 'top' },
                    React.createElement(
                        'div',
                        { 'class': 'input' },
                        React.createElement('input', { type: 'text', value: this.state.value,
                            onChange: this.handleChange, onKeyDown: this.handleKeyDown,
                            placeholder: 'search',
                            autoFocus: 'true',
                            ref: function ref(input) {
                                return input && input.focus();
                            } }),
                        React.createElement(
                            'span',
                            { 'class': 'clear', onClick: this.handleClear },
                            React.createElement(
                                'svg',
                                { focusable: 'false', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24' },
                                React.createElement('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'results-count' },
                        React.createElement(
                            'span',
                            null,
                            this.state.result.length,
                            ' results'
                        )
                    )
                ),
                React.createElement('br', null),
                React.createElement(
                    'div',
                    { 'class': 'results' },
                    this.state.result.slice(0, this.state.maxResults).map(function (r) {
                        return React.createElement(Result, { key: r.ref, doc: store[r.ref] });
                    }),
                    this.state.result.length > this.state.maxResults ? React.createElement(
                        'button',
                        { 'class': 'load-more', onClick: this.handleMoreClick },
                        'Load more results'
                    ) : null
                )
            );
        }
    }]);

    return SearchField;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(SearchField, null), domContainer);