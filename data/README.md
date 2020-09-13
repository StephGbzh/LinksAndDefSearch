# Examples of data

Some datasets in json format can found [here](https://github.com/jdorfman/Awesome-JSON-Datasets).

## Stade Rennais football players

Source: <https://fr.wikipedia.org/wiki/Liste_des_joueurs_du_Stade_rennais_football_club>

760 entries, < 100 kB and 6 fields per entry.

### Fields

Nom, Prénom

`document.querySelectorAll("h3 + table")[0].querySelectorAll("tbody > tr")[1].querySelectorAll("td")[0].querySelector("a").textContent.trim()`

Nationalité

`document.querySelectorAll("h3 + table")[0].querySelectorAll("tbody > tr")[1].querySelectorAll("td")[1].querySelector("span").textContent.trim()`

Période
`document.querySelectorAll("h3 + table")[0].querySelectorAll("tbody > tr")[9].querySelectorAll("td")[2].innerText`

- 1993-1995 => 1993 1994 1995
- 2020- => 2020
- 20132015-2016 => 2013 2015 2016
- 2019- => 2019 2020
- 2013 => 2013
- 1974-19761979-1982 => 1974 1975 1976 1979 1980 1981 1982

Poste

`document.querySelectorAll("h3 + table")[0].querySelectorAll("tbody > tr")[1].querySelectorAll("td")[3].textContent.trim()`

Matchs

`document.querySelectorAll("h3 + table")[0].querySelectorAll("tbody > tr")[1].querySelectorAll("td")[4].textContent.trim()`
if empty => 0

Buts

`document.querySelectorAll("h3 + table")[0].querySelectorAll("tbody > tr")[1].querySelectorAll("td")[5].textContent.trim()`
if empty => 0

### JSON

#### Header

```json
  "fields": {
    "Nom, Prénom": { "type": "text" },
    "Nationalité": { "type": "text" },
    "Période": { "type": "text" },
    "Poste": { "type": "text" },
    "Matchs": { "type": "text", "prefix":true },
    "Buts": { "type": "text", "prefix":true }
  },
```

#### Transform wikipedia page tables into json

- <http://www.wikitable2json.com/>
- <http://www.wikitable2json.com/swagger-ui/#/WikiTable/WikiTable_GetTables>

#### Transform raw json into usable json with jq

```bash
cat Liste_des_joueurs_du_Stade_rennais_football_club.json | jq '.tables[].rows[].columns' | jq '[inputs]' | jq 'map(select(."1" != "Nationalité"))' | jq  '.[] | {"Nom, Prénom": ."0", "Nationalité":."1", "Période":."2", "Poste":."3", "Matchs":(if ."4" != "" then ."4" else null end), "Buts":(if ."5" != "" then ."5" else null end) }' | jq -n '[inputs]' | jq -n '.documents |= inputs' > rennes_players.json
```

But not powerful enough to do everything ...

#### Node.js

Write a js script that loads the original json and writes a json file with all the desired modifications:

`node wikipedia_format.js`

## Movies

Source: <https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json>

28795 entries, > 3 MB and 4 fields per entry.

```json
"fields": {
  "title":{ "type": "text" },
  "year":{ "type": "text" },
  "cast":{ "type": "list" },
  "genre":{ "type": "list" }
}
```

The file is quite long to load ~20 seconds. The search can be slow if the number of results is > ~300.

- [Can I limit the number of returned results?](https://github.com/olivernn/lunr.js/issues/135)
- [Lunr with a large index (800,000 items)](https://github.com/olivernn/lunr.js/issues/222)
