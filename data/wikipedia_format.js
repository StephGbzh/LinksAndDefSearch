var fs = require("fs");

var jsonRaw = fs.readFileSync("response_1599679488244.json");
var jsonIn = JSON.parse(jsonRaw);

// add fields description
// init documents
const json = {
  fields: {
    "Nom, Prénom": { type: "text" },
    Nationalité: { type: "text" },
    Saisons: { type: "list" },
    Poste: { type: "text" },
    Matchs: { type: "text", prefix: true },
    Buts: { type: "text", prefix: true },
  },
  documents: [],
};

extractSeasons = (period) => {
  // console.log("A", period);
  year1 = parseInt(period.substring(0, 4));
  years = [`${year1}-${year1+1}`];
  period = period.substring(4);
  while (period.length > 0) {
    if (period.charAt(0) == "-") {
      if (period.length == 1) {
        for (let y = year1+1; y < new Date().getFullYear(); y++) {
          years.push(`${y}-${y+1}`);
        }
        period = "";
      } else {
        year2 = parseInt(period.substring(1, 5));
        for (let y = year1+1; y < year2; y++) {
          years.push(`${y}-${y+1}`);
        }
        period = period.substring(5);
      }
    } else {
      year1 = parseInt(period.substring(0, 4));
      years.push(`${year1}-${year1+1}`)
      period = period.substring(4);
    }
  }
  // console.log("B", years)
  return years
};

// format data
jsonIn.tables.forEach((table) => {
  for (const [rowKey, row] of Object.entries(table.rows)) {
    // the first row is only the headers
    if (rowKey == "0") {
      continue;
    }
    doc = {};
    for (const [colKey, columnValue] of Object.entries(row.columns)) {
      const columnName = table.rows["0"].columns[colKey];

      if (columnName == "Période") {
        // doc["Période"] = columnValue
        doc["Saisons"] = extractSeasons(columnValue)
      } else {
        // remove annotations: "Aoued[2] *"" becomes just "Aoued"
        doc[columnName] = columnValue.replace(/\s*(\[\d+\],?)*\s*\**\s*$/, "");
      }
    }
    json.documents.push(doc);
  }
});

//console.log(JSON.stringify(json));

try {
  const data = fs.writeFileSync('rennes_players.json', JSON.stringify(json))
  //file written successfully
} catch (err) {
  console.error(err)
}
