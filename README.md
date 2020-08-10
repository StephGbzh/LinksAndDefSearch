# Overview

- Static single webpage with search-as-you-type capability on any data you provide
- POC (ie this very repository) runs on Github-Pages at https://stephgbzh.github.io/customta/
  - when the search field is empty, you can see all unfiltered results (within a limit and a "Load more" button)
  - type ESC in the search field to clear your last search
- Data is set in data.js as a simple json array, any change is reflected upon refresh (F5) of the HTML page (give Github a few seconds to automatically deploy the new version)
- Locally the page to open is simply index.html and works the same way
- Powered by [Lunr](https://lunrjs.com/) and [React](https://reactjs.org/)
- Source code is in src/main.jsx (no need to change anything here if you just want to use the search)
- [Babel](https://babeljs.io/) through npx transforms this jsx code to plain js (see further below for the exact command)
- Tested only with small amounts of data, bigger ones may be slow to handle

# How to use

The present repo is a demo with some (small amount of) arbitrary data. You will need to clone or fork it to customize the data you want to be searchable.

## Locally

1. Clone the repository, you will need these files:
    - index.html
    - style.css
    - data.js
    - main.js
    - libs/lunr@2.3.8.min.js
    - libs/react@16.13.1.production.min.js
    - libs/react-dom@16.13.1.production.min.js
    - favicon.ico

1. Modify data.js to put the data you are interested in
1. Open index.html in your browser
1. Start searching !

## Hosted on GitHub

1. Fork the repository.
1. Modify data.js to put the data you are interested in
1. Go to your repo Settings > Options > GitHub Pages > Source: choose branch = master and folder = / (root)
1. This will create a website hosted on GitHub (you may need a small delay for it to be created + a refresh of the page to get the address)
1. Access this site and start searching ! 

# JS Search Engines

## [LUNR](https://lunrjs.com/)


### Simple

Designed to be small, yet full featured, Lunr enables you to provide a great search experience without the need for external, server-side, search services.

### Extensible

Add powerful language processors to give more accurate results to user queries, or tweak the built-in processors to better fit your content.

### Everywhere

Lunr has no external dependencies and works in your browser or on the server with node.js


Pros:
- lightweight (6 kB)
- search with wildcards
- boosts fields
- fuzzy search

Cons:
- slower ? not sure, the benchmarks were made against v2.x
- indexes are immutable => no add/update/delete
- need to tweak with worse perf to access reliable wildcard + "AND" functionalities [link](https://github.com/olivernn/lunr.js/issues/377#issuecomment-426380071)


[How to generate search result from lunr.js](https://github.com/Pelican-Elegant/elegant/issues/275#issuecomment-580791143)

- https://codewithhugo.com/hugo-lunrjs-search-index/
- https://matthewdaly.co.uk/blog/2015/04/18/how-i-added-search-to-my-site-with-lunr-dot-js/
- https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/


## [Elasticlunr.js](http://elasticlunr.com/)

Lightweight full-text search engine in Javascript for browser search and offline search.

Elasticlunr.js is a lightweight full-text search engine in Javascript for browser search and offline search. Elasticlunr.js is developed based on Lunr.js, but more flexible than lunr.js. Elasticlunr.js provides Query-Time boosting and field search. Elasticlunr.js is a bit like Solr, but much smaller and not as bright, but also provide flexible configuration and query-time boosting.

Elasticlunr.js use quite the same scoring mechanism as Elasticsearch

Pros:
- faster than lunr

Cons:
- [no wildcard search](https://github.com/weixsong/elasticlunr.js/issues/81), only suffixes: micro will get microservice and microcosm but NOT minimicro

## [Fuse.js](https://fusejs.io/)

Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies.

What is fuzzy searching?

Generally speaking, fuzzy searching (more formally known as approximate string matching) is the technique of finding strings that are approximately equal to a given pattern (rather than exactly).

Why should I use it ?

- With Fuse.js, you don’t need to setup a dedicated backend just to handle search.
- Simplicity and performance were the main criteria when developing this library.

When should I use it ?

It might not make sense for every situation, but can be ideal depending on your search requirements. For example:

- When you want client-side fuzzy searching of small to moderately large data sets.
- When you can't justify setting up a dedicated backend simply to handle search. ElasticSearch or Algolia, although both great services, may be overkill for your particular use cases.

Pros:
- still maintained

Cons:
- not really looked into it

## [search-index](https://github.com/fergiemcdowall/search-index)

A network resilient, persistent full-text search library for the browser and Node.js

Pros:
- still maintained

Cons:
- not really looked into it

## [js-search](https://github.com/bvaughn/js-search)

Js Search enables efficient client-side searches of JavaScript and JSON objects. It is ES5 compatible and does not require jQuery or any other third-party libraries.

Js Search began as a lightweight implementation of Lunr JS, offering runtime performance improvements and a smaller file size. It has since expanded to include a rich feature set- supporting stemming, stop-words, and TF-IDF ranking.

[Gatsby: Adding Search with JS Search](https://www.gatsbyjs.org/docs/adding-search-with-js-search/)

Pros:
- still maintained
- search by prefix or substring or exact word

Cons:
- not really looked into it

## [flexsearch](https://github.com/nextapps-de/flexsearch)

Next-Generation full text search library for Browser and Node.js

Pros:
- fastest one (self proclaimed though)

Cons:
- [not maintained](https://github.com/nextapps-de/flexsearch/issues/150) anymore since Nov 2019

# [Add React to a Website](https://reactjs.org/docs/getting-started.html)

For development, add these scripts:

```js
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.min.js" crossorigin></script>
```

Add minified scripts for react & react-dom

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

Add JSX to a Project (node.js must be installed)

`npm init -y`

`npm install babel-cli@6 babel-preset-react-app@3`

Create a folder `src` and start the automatic watcher:

`npx babel --watch src --out-dir . --presets react-app/prod`

[Minification of js files for production](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)

# [Adding an existing project to Github](https://docs.github.com/en/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line)

# [Favicon](https://favicon.io/emoji-favicons/magnifying-glass-tilted-right/)

