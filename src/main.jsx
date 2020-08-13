'use strict';

const useState = React.useState
const useCallback = React.useCallback
const useEffect = React.useEffect

const store = {}

var idx = lunr(function () {
    this.ref('key')
    // https://lunrjs.com/docs/lunr.Builder.html#field
    Object.entries(fields).forEach(([field, attributes]) => {
        this.field(field, attributes)
    })

    // remove the stemmer as it breaks some wildcard searches
    // the performance will be worse but no big deal as long as we don't have too much data
    // https://github.com/olivernn/lunr.js/issues/377#issuecomment-426380071
    // possible other workaround https://github.com/hoelzro/tw-full-text-search/issues/9
    // same pb https://github.com/olivernn/lunr.js/issues/421
    this.pipeline.remove(lunr.stemmer);
    this.searchPipeline.remove(lunr.stemmer);

    documents.forEach((doc, i) => {
        doc["key"] = i
        this.add(doc)
        store[i] = doc
    }, this)
})

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
const stringToColour = (str) => {
    var hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash *= 100;
    var colour = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

const Tag = ({ tag, index, color }) => (
    <div class="tag" style={{
        border: "thin solid " + color,
        marginLeft: (index == 0 ? "0" : "2px")
    }}>
        <span class="tag-dot" style={{
            backgroundColor: color
        }}></span>
        <span class="tag-text">{tag}</span>
    </div>
)

const Result = ({ doc }) => (
    <div class="result">
        {Object.entries(fields).map(([field, { type }]) => {
            switch (type) {
                case "list":
                    return <div class="result-list">
                        {doc[field].map((tag, i) =>
                            <Tag key={tag} tag={tag} index={i} color={stringToColour(tag)} />)}
                    </div>
                case "link":
                    return <div class="result-link">
                        <a href={doc[field]} target="_blank">{doc[field]}</a>
                    </div>
                case "text":
                    return <div>{doc[field]}</div>
                default:
                    return <div>Field "{field}" of unknown type: {type}</div>
            }
        })}
    </div>
)

const MAX_RESULTS_DEFAULT = 10
const fullResults = idx.search("*")

// https://reactjs.org/docs/hooks-state.html
// https://stackoverflow.com/questions/53215067/how-can-i-bind-function-with-hooks-in-react
// https://reactjs.org/docs/hooks-reference.html#usecallback
const SearchField = () => {
    const [search, setSearch] = useState({ raw: '', reworked: '', results: fullResults })
    const [maxResults, setMaxResults] = useState(MAX_RESULTS_DEFAULT)

    const handleChange = useCallback((event) => {
        const reworkedSearch = event.target.value.trim() == "" ? ""
            : "+*" + event.target.value.trim().replace(/\s+/g, "* +*") + "*"

        setSearch({
            raw: event.target.value,
            reworked: reworkedSearch,
            results: reworkedSearch == search.reworked ?
                search.results :
                reworkedSearch == "" ? fullResults : idx.search(reworkedSearch)
        })
        setMaxResults(MAX_RESULTS_DEFAULT)
    }, [])

    const handleKeyDown = useCallback((event) => {
        if (event.keyCode == 27) { // ESC
            event.preventDefault()
            clearSearchBar()
        }
    }, [])

    const handleMoreClick = useCallback((event) => {
        event.preventDefault()
        setMaxResults(maxResults + MAX_RESULTS_DEFAULT)
    }, [])

    const handleClear = useCallback((event) => {
        event.preventDefault()
        clearSearchBar()
    }, [])

    const clearSearchBar = () => {
        setSearch({ raw: "", reworked: "", results: fullResults })
        setMaxResults(MAX_RESULTS_DEFAULT)
    }

    return (
        <div class="main">
            <div class="top">
                <div class="input">
                    <input type="text" value={search.raw}
                        onChange={handleChange} onKeyDown={handleKeyDown}
                        placeholder="search"
                        autoFocus="true"
                        // https://stackoverflow.com/a/40235334
                        ref={input => input && input.focus()} />
                    <span class="clear" onClick={handleClear}>
                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                    </span>
                </div>
                <div class="results-count">
                    <span>{search.results.length} results</span>
                </div>
            </div>
            <br></br>

            <div class="results">
                {search.results.slice(0, maxResults).map((r) =>
                    <Result key={r.ref} doc={store[r.ref]} />
                )}

                {search.results.length > maxResults ?
                    <button class="load-more" onClick={handleMoreClick}>Load more results</button> : null}
            </div>
        </div>
    )
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<SearchField />, domContainer);