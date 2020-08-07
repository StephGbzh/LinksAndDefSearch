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
- slower ? not sure the benchmarks were made against v2.x
- indexes are immutable => no add/update/delete


[How to generate search result from lunr.js](https://github.com/Pelican-Elegant/elegant/issues/275#issuecomment-580791143)

- https://codewithhugo.com/hugo-lunrjs-search-index/
- https://matthewdaly.co.uk/blog/2015/04/18/how-i-added-search-to-my-site-with-lunr-dot-js/
- https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/


## [Elasticlunr.js](http://elasticlunr.com/)

Lightweight full-text search engine in Javascript for browser search and offline search.

Elasticlunr.js is a lightweight full-text search engine in Javascript for browser search and offline search. Elasticlunr.js is developed based on Lunr.js, but more flexible than lunr.js. Elasticlunr.js provides Query-Time boosting and field search. Elasticlunr.js is a bit like Solr, but much smaller and not as bright, but also provide flexible configuration and query-time boosting.

Elasticlunr.js use quite the same scoring mechanism as Elasticsearch

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

## [search-index](https://github.com/fergiemcdowall/search-index)

A network resilient, persistent full-text search library for the browser and Node.js

Pros:
- still maintained

## [js-search](https://github.com/bvaughn/js-search)

Js Search enables efficient client-side searches of JavaScript and JSON objects. It is ES5 compatible and does not require jQuery or any other third-party libraries.

Js Search began as a lightweight implementation of Lunr JS, offering runtime performance improvements and a smaller file size. It has since expanded to include a rich feature set- supporting stemming, stop-words, and TF-IDF ranking.

[Gatsby: Adding Search with JS Search](https://www.gatsbyjs.org/docs/adding-search-with-js-search/)

Pros:
- still maintained
- search by prefix or substring or exact word

## [flexsearch](https://github.com/nextapps-de/flexsearch)

Next-Generation full text search library for Browser and Node.js

Pros:
- fastest one

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