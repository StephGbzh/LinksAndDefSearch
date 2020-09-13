var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var useState = React.useState;
var useCallback = React.useCallback;
var useEffect = React.useEffect;

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
var stringToColour = function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash *= 100;
    var colour = "#";
    for (var _i = 0; _i < 3; _i++) {
        var value = hash >> _i * 8 & 0xff;
        colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
};

var Tag = function Tag(_ref) {
    var tag = _ref.tag,
        index = _ref.index,
        color = _ref.color,
        display = _ref.display;
    return React.createElement(
        "div",
        {
            "class": "tag",
            style: {
                border: "thin solid " + color
            } },
        React.createElement("span", {
            "class": "tag-dot",
            style: {
                backgroundColor: color
            } }),
        React.createElement(
            "span",
            { "class": "tag-text" },
            display ? Function('"use strict";return (' + display + ")")()(tag) : tag
        )
    );
};

var Result = function Result(_ref2) {
    var doc = _ref2.doc;
    return React.createElement(
        "div",
        { "class": "result" },
        Object.entries(fields).map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                field = _ref4[0],
                _ref4$ = _ref4[1],
                type = _ref4$.type,
                display = _ref4$.display;

            if (!doc[field]) {
                return null;
            }
            switch (type) {
                case "list":
                    return React.createElement(
                        "div",
                        { "class": "result-list" },
                        doc[field].map(function (tag, i) {
                            return React.createElement(Tag, {
                                key: tag,
                                tag: tag,
                                index: i,
                                color: stringToColour(tag.toString()),
                                display: display
                            });
                        })
                    );
                case "link":
                    return React.createElement(
                        "div",
                        { "class": "result-link" },
                        React.createElement(
                            "a",
                            { href: doc[field], target: "_blank" },
                            doc[field]
                        )
                    );
                case "text":
                    return React.createElement(
                        "div",
                        null,
                        "" + (display ? Function('"use strict";return (' + display + ")")()(field, doc[field]) : doc[field])
                    );
                default:
                    return React.createElement(
                        "div",
                        null,
                        "Field \"",
                        field,
                        "\" of unknown type: ",
                        type
                    );
            }
        })
    );
};

var MAX_RESULTS_DEFAULT = 10;

// https://reactjs.org/docs/hooks-state.html
// https://stackoverflow.com/questions/53215067/how-can-i-bind-function-with-hooks-in-react
// https://reactjs.org/docs/hooks-reference.html#usecallback
var SearchField = function SearchField() {
    var _useState = useState({
        raw: "",
        reworked: "",
        results: fullResults
    }),
        _useState2 = _slicedToArray(_useState, 2),
        search = _useState2[0],
        setSearch = _useState2[1];

    var _useState3 = useState(MAX_RESULTS_DEFAULT),
        _useState4 = _slicedToArray(_useState3, 2),
        maxResults = _useState4[0],
        setMaxResults = _useState4[1];

    var handleChange = useCallback(function (event) {
        var reworkedSearch = event.target.value.trim() == "" ? "" : "+*" + event.target.value.trim().replace(/\s+/g, "* +*") + "*";

        setSearch({
            raw: event.target.value,
            reworked: reworkedSearch,
            results: reworkedSearch == search.reworked ? search.results : reworkedSearch == "" ? fullResults : idx.search(reworkedSearch)
        });
        setMaxResults(MAX_RESULTS_DEFAULT);
    }, [search, maxResults]);

    var handleKeyDown = useCallback(function (event) {
        if (event.keyCode == 27) {
            // ESC
            event.preventDefault();
            clearSearchBar();
        }
    }, [search, maxResults]);

    var handleMoreClick = useCallback(function (event) {
        event.preventDefault();
        setMaxResults(maxResults + MAX_RESULTS_DEFAULT);
    }, [maxResults]);

    var handleClear = useCallback(function (event) {
        event.preventDefault();
        clearSearchBar();
    }, [search, maxResults]);

    var clearSearchBar = function clearSearchBar() {
        setSearch({ raw: "", reworked: "", results: fullResults });
        setMaxResults(MAX_RESULTS_DEFAULT);
    };

    return React.createElement(
        "div",
        { "class": "main" },
        React.createElement(
            "div",
            { "class": "top" },
            React.createElement(
                "div",
                { "class": "top-line" },
                React.createElement(
                    "div",
                    { "class": "input" },
                    React.createElement("input", {
                        type: "text",
                        value: search.raw,
                        onChange: handleChange,
                        onKeyDown: handleKeyDown,
                        placeholder: "search",
                        autoFocus: "true"
                        // https://stackoverflow.com/questions/28889826/how-to-set-focus-on-an-input-field-after-rendering/40235334#40235334
                        , ref: function ref(input) {
                            return input && input.focus();
                        }
                    }),
                    React.createElement(
                        "span",
                        { "class": "clear", onClick: handleClear },
                        React.createElement(
                            "svg",
                            { focusable: "false", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
                            React.createElement("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { "class": "results-count" },
                React.createElement(
                    "span",
                    null,
                    search.results.length,
                    " result",
                    search.results.length == 1 ? "" : "s"
                )
            )
        ),
        React.createElement("br", null),
        React.createElement(
            "div",
            { "class": "results" },
            search.results.slice(0, maxResults).map(function (r) {
                return React.createElement(Result, { key: r.ref, doc: store[r.ref] });
            }),
            search.results.length > maxResults ? React.createElement(
                "button",
                { "class": "load-more", onClick: handleMoreClick },
                "Load more results"
            ) : null
        )
    );
};

var store = {};
var fullResults;
var idx;
var fields;

// https://stephgbzh.github.io/customta/?json=https://raw.githubusercontent.com/StephGbzh/customta/master/data.json
var params = new URLSearchParams(window.location.search);
var defaultJsonUrl;

if (params.has("json")) {
    defaultJsonUrl = params.get("json");
} else {
    defaultJsonUrl = "https://raw.githubusercontent.com/StephGbzh/customta/master/data.json";
}

fetch(defaultJsonUrl).then(function (response) {
    return response.json();
}).then(function (json) {
    fields = json.fields;
    var documents = json.documents;
    idx = lunr(function () {
        var _this = this;

        this.ref("key");
        // https://lunrjs.com/docs/lunr.Builder.html#field
        Object.entries(fields).forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                field = _ref6[0],
                attributes = _ref6[1];

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
    fullResults = idx.search("*");

    var domContainer = document.querySelector("#root");
    ReactDOM.render(React.createElement(SearchField, null), domContainer);
});