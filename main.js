'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var useState = React.useState;
var useCallback = React.useCallback;

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
var fullResults = idx.search("*");

// https://reactjs.org/docs/hooks-state.html
// https://stackoverflow.com/questions/53215067/how-can-i-bind-function-with-hooks-in-react
// https://reactjs.org/docs/hooks-reference.html#usecallback
var SearchField = function SearchField() {
    var _useState = useState(''),
        _useState2 = _slicedToArray(_useState, 2),
        value = _useState2[0],
        setValue = _useState2[1];

    var _useState3 = useState(fullResults),
        _useState4 = _slicedToArray(_useState3, 2),
        result = _useState4[0],
        setResult = _useState4[1];

    var _useState5 = useState(""),
        _useState6 = _slicedToArray(_useState5, 2),
        searchString = _useState6[0],
        setSearchString = _useState6[1];

    var _useState7 = useState(MAX_RESULTS_DEFAULT),
        _useState8 = _slicedToArray(_useState7, 2),
        maxResults = _useState8[0],
        setMaxResults = _useState8[1];

    var handleChange = useCallback(function (event) {
        var newSearchString = event.target.value.trim() == "" ? "" : "+*" + event.target.value.trim().replace(/\s+/g, "* +*") + "*";

        setValue(event.target.value);
        setResult(newSearchString == searchString ? result : newSearchString == "" ? fullResults : idx.search(newSearchString));
        setSearchString(newSearchString);
        setMaxResults(MAX_RESULTS_DEFAULT);
    }, []);

    var handleKeyDown = useCallback(function (event) {
        if (event.keyCode == 27) {
            // ESC
            event.preventDefault();
            clearSearchBar();
        }
    }, []);

    var handleMoreClick = useCallback(function (event) {
        event.preventDefault();
        setMaxResults(maxResults + MAX_RESULTS_DEFAULT);
    }, []);

    var handleClear = useCallback(function (event) {
        event.preventDefault();
        clearSearchBar();
    }, []);

    var clearSearchBar = function clearSearchBar() {
        setValue("");
        setResult(fullResults);
        setSearchString("");
        setMaxResults(MAX_RESULTS_DEFAULT);
    };

    return React.createElement(
        'div',
        { 'class': 'main' },
        React.createElement(
            'div',
            { 'class': 'top' },
            React.createElement(
                'div',
                { 'class': 'input' },
                React.createElement('input', { type: 'text', value: value,
                    onChange: handleChange, onKeyDown: handleKeyDown,
                    placeholder: 'search',
                    autoFocus: 'true'
                    // https://stackoverflow.com/a/40235334
                    , ref: function ref(input) {
                        return input && input.focus();
                    } }),
                React.createElement(
                    'span',
                    { 'class': 'clear', onClick: handleClear },
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
                    result.length,
                    ' results'
                )
            )
        ),
        React.createElement('br', null),
        React.createElement(
            'div',
            { 'class': 'results' },
            result.slice(0, maxResults).map(function (r) {
                return React.createElement(Result, { key: r.ref, doc: store[r.ref] });
            }),
            result.length > maxResults ? React.createElement(
                'button',
                { 'class': 'load-more', onClick: handleMoreClick },
                'Load more results'
            ) : null
        )
    );
};

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(SearchField, null), domContainer);