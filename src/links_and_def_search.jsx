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
    <div style={{
        border: "thin solid " + color,
        borderRadius: "5px",
        marginLeft: (index == 0 ? "0" : "2px")
    }}>
        <span style={{
            width: "10px",
            height: "10px",
            marginLeft: "2px",
            display: "inline-block",
            backgroundColor: color
        }}></span>
        <span style={{
            marginLeft: "2px",
            marginRight: "2px"
        }}>{tag}</span>
    </div>
)

const Result = ({ doc }) => (
    <div style={{ margin: "20px auto", width: "60%" }}>
        {Object.entries(fields).map(([field, {type}]) => {
            switch (type) {
                case "list":
                    return <div style={{ display: "inline-flex" }}>
                        {doc[field].map((tag, i) =>
                            <Tag key={tag} tag={tag} index={i} color={stringToColour(tag)} />)}
                    </div>
                case "link":
                    return <div style={{ margin: "3px 0" }}>
                        <a href={doc[field]}>{doc[field]}</a>
                    </div>
                case "text":
                    return <div>{doc[field]}</div>
                default:
                    return <div>Field "{field}" of unknown type: {type}</div>
            }
        })}
    </div>
)

class SearchField extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '', result: idx.search("*"), searchString: "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
            searchString
        });
    }

    handleKeyDown(event) {
        if (event.keyCode == 27) { // ESC
            event.preventDefault()
            this.setState({ value: "", result: idx.search("*"), searchString: "" })
        }
    }

    render() {
        return (
            <div>
                <form style={{ margin: "0 auto", width: "60%" }}>
                    <label>
                        <input type="text" value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleKeyDown}
                            style={{ width: "100%", lineHeight: "40px", fontSize: "large" }}
                            placeholder="search" />
                    </label>
                </form>
                <br></br>

                {this.state.result.map((r) => { return (<Result key={r.ref} doc={store[r.ref]} />) })}

            </div>
        );
    }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<SearchField />, domContainer);