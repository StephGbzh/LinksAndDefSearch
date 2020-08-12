'use strict';

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

class SearchField extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '', result: idx.search("*"), searchString: "", maxResults: MAX_RESULTS_DEFAULT };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMoreClick = this.handleMoreClick.bind(this);
    }

    handleChange(event) {
        if (event.target.value == this.state.value) {
            return
        }
        const searchString = event.target.value.trim() == "" ? ""
            : "+*" + event.target.value.trim().replace(/\s+/g, "* +*") + "*"

        this.setState({
            value: event.target.value,
            result: searchString == this.state.searchString ?
                this.state.result :
                searchString == "" ? idx.search("*") : idx.search(searchString),
            maxResults: MAX_RESULTS_DEFAULT
        });
    }

    handleKeyDown(event) {
        if (event.keyCode == 27) { // ESC
            event.preventDefault()
            this.setState({ value: "", result: idx.search("*"), searchString: "", maxResults: MAX_RESULTS_DEFAULT })
        }
    }

    handleMoreClick(event) {
        event.preventDefault()
        this.setState({ maxResults: this.state.maxResults + MAX_RESULTS_DEFAULT })
    }

    render() {
        return (
            <div class="main">
                <div class="form">
                    <form>
                        <label>
                            <input type="text" value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleKeyDown}
                                placeholder="search" />
                        </label>
                    </form>
                    <div class="results-count">
                        <span>{this.state.result.length} results</span>
                    </div>
                </div>
                <br></br>

                <div class="results">
                    {this.state.result.slice(0, this.state.maxResults).map((r) =>
                        <Result key={r.ref} doc={store[r.ref]} />
                    )}

                    {this.state.result.length > this.state.maxResults ?
                        <button class="load-more" onClick={this.handleMoreClick}>Load more results</button> : null}
                </div>
            </div>
        );
    }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<SearchField />, domContainer);