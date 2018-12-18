const
  conf = require('./config.js'),
  utils = require('./utils/utils.js'),
  jscrape = require('./scrape.js');

///////////////////////
//EDIT updateDoc to determine how to update
//////////////////////
function updateDoc(d) {
// e.g 
// d["newField"] = "newValue"
// return  d;
}

async function testBackfill(key) {
  const secrets = await utils.readSecrets();
  const dbData = await utils.connectToData(secrets);
  
  const query = {key: key};
  let keyDoc = await dbData.find(query).toArray();
  keyDoc.forEach((d) => {
    const newDoc = updateDoc(d);
    dbData.updateOne(query, {$set: newDoc});
  });
  
  console.log("Backfill of", key, "complete");
}

async function backfillAll() {
  const secrets = await utils.readSecrets();
  const dbData = await utils.connectToData(secrets);
  // const dbSanitizedData = await utils.connectToSanitizedData(secrets);
  
  let keyDoc = await dbData.find().toArray();
  keyDoc.forEach((d) => {
    const query = {key: d['key']};
    const newDoc = updateDoc(d);
    dbData.updateOne(query, {$set: newDoc});
  });
  
  console.log("Backfill All complete");
}

// testBackfill('medium');
backfillAll();