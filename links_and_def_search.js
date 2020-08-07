'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};

var idx = lunr(function () {
    var _this = this;

    this.ref('key');
    this.field('link');
    this.field('tags');

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

var Tag = function Tag(_ref) {
    var tag = _ref.tag,
        index = _ref.index,
        color = _ref.color;
    return React.createElement(
        'div',
        { style: {
                border: "thin solid " + color,
                borderRadius: "5px",
                marginLeft: index == 0 ? "0" : "2px"
            } },
        React.createElement('span', { style: {
                width: "10px",
                height: "10px",
                marginLeft: "2px",
                display: "inline-block",
                backgroundColor: color
            } }),
        React.createElement(
            'span',
            { style: {
                    marginLeft: "2px",
                    marginRight: "2px"
                } },
            tag
        )
    );
};

var Link = function Link(_ref2) {
    var doc = _ref2.doc;
    return React.createElement(
        'div',
        { style: { margin: "10px auto", width: "60%" } },
        React.createElement(
            'div',
            { style: { display: "inline-flex" } },
            doc.tags.map(function (tag, i) {
                return React.createElement(Tag, { key: tag, tag: tag, index: i, color: stringToColour(tag) });
            })
        ),
        React.createElement(
            'div',
            { style: { marginTop: "3px" } },
            React.createElement(
                'a',
                { href: doc.link },
                doc.link
            )
        )
    );
};

var SearchField = function (_React$Component) {
    _inherits(SearchField, _React$Component);

    function SearchField(props) {
        _classCallCheck(this, SearchField);

        var _this2 = _possibleConstructorReturn(this, (SearchField.__proto__ || Object.getPrototypeOf(SearchField)).call(this, props));

        _this2.state = { value: '', result: [], searchString: "" };
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.handleKeyDown = _this2.handleKeyDown.bind(_this2);
        return _this2;
    }

    _createClass(SearchField, [{
        key: 'handleChange',
        value: function handleChange(event) {
            if (event.target.value == this.state.value) {
                return;
            }
            var searchString = event.target.value.trim() == "" ? "" : "+*" + event.target.value.trim().replace(/\s+/g, "* +*") + "*";

            this.setState({
                value: event.target.value,
                result: searchString == this.state.searchString ? this.state.result : searchString == "" ? [] : idx.search(searchString),
                searchString: searchString
            });
        }
    }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(event) {
            if (event.keyCode == 27) {
                // ESC
                event.preventDefault();
                this.setState({ value: "", result: [], searchString: "" });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'form',
                    { style: { margin: "0 auto", width: "60%" } },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', { type: 'text', value: this.state.value, onChange: this.handleChange, onKeyDown: this.handleKeyDown,
                            style: { width: "100%", lineHeight: "40px", fontSize: "large" },
                            placeholder: 'search' })
                    )
                ),
                React.createElement('br', null),
                this.state.result.map(function (r) {
                    return React.createElement(Link, { key: r.ref, doc: store[r.ref] });
                })
            );
        }
    }]);

    return SearchField;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(SearchField, null), domContainer);