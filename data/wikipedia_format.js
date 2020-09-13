const fs = require("fs")
const fetch = require("node-fetch")
const process = require("process")

const rawDataFile = "rennes_players_wikipedia.json"

(async () => {
  let jsonIn
  
  if (
    !fs.existsSync(rawDataFile) ||
    (process.argv.length > 2 && process.argv[2] == "dl")
  ) {
    const download = async (url, filename) => {
      try {
        const response = await fetch(url)
        jsonIn = await response.json()
        fs.writeFileSync(filename, JSON.stringify(jsonIn))
      } catch (error) {
        console.log(error)
      }
    }

    await download(
      "http://www.wikitable2json.com/api/v1/page/Liste_des_joueurs_du_Stade_rennais_football_club?lang=fr",
      rawDataFile
    )
  } else {
    const jsonRaw = fs.readFileSync(rawDataFile)
    jsonIn = JSON.parse(jsonRaw)
  }

  // add fields description
  // init documents
  const json = {
    fields: {
      "Nom, Prénom": { type: "text" },
      Nationalité: { type: "text" },
      Saisons: { type: "list", boost: 100, display: "(v) => `${v}-${v+1}`" },
      Poste: { type: "text" },
      Matchs: { type: "text", display: "(f,v) => `${f}: ${v}`" },
      Buts: { type: "text", display: "(f,v) => `${f}: ${v}`" },
    },
    documents: [],
  }

  const extractYears = (period) => {
    // console.log("A", period)
    year1 = parseInt(period.substring(0, 4))
    years = [year1]
    period = period.substring(4)
    while (period.length > 0) {
      if (period.charAt(0) == "-") {
        if (period.length == 1) {
          for (let y = year1 + 1; y <= new Date().getFullYear(); y++) {
            years.push(y)
          }
          period = ""
        } else {
          year2 = parseInt(period.substring(1, 5))
          for (let y = year1 + 1; y < year2; y++) {
            years.push(y)
          }
          period = period.substring(5)
        }
      } else {
        year1 = parseInt(period.substring(0, 4))
        years.push(year1)
        period = period.substring(4)
      }
    }
    // console.log("B", years)
    return years
  }

  // format data
  jsonIn.tables.forEach((table) => {
    for (const [rowKey, row] of Object.entries(table.rows)) {
      // the first row is only the headers
      if (rowKey == "0") {
        continue
      }
      doc = {}
      for (const [colKey, columnValue] of Object.entries(row.columns)) {
        const columnName = table.rows["0"].columns[colKey]

        if (columnName == "Période") {
          // doc["Période"] = columnValue
          doc["Saisons"] = extractYears(columnValue)
        } else {
          // remove annotations: "Aoued[2] *"" becomes just "Aoued"
          doc[
            columnName == "Nom" ? "Nom, Prénom" : columnName
          ] = columnValue.replace(/\s*(\[\d+\],?)*\s*\**\s*$/, "")
        }
      }
      json.documents.push(doc)
    }
  })

  //console.log(JSON.stringify(json))

  try {
    fs.writeFileSync("rennes_players.json", JSON.stringify(json))
  } catch (err) {
    console.error(err)
  }
})()
