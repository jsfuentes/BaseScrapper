const
  utils = require('./utils/utils.js');

function addDateToDoc(d) {
  var date = new Date();

  backupD = {
    ...d,
    date: date.toDateString(),
  }
  return backupD;
}

async function backup() {
  const secrets = await utils.readSecrets();
  const dbData = await utils.connectToData(secrets);
  const dbBackup = await utils.connectToBackup(secrets);
  
  let doc = await dbData.find().toArray();
  doc.forEach((d) => {
    //TO TEST: add former id, id["former_id"] = d["_id"]
    delete d["_id"]; //need unique ids, and we want multiple versions in the same db  
    dbBackup.insertOne(addDateToDoc(d));
  });
  
  console.log("Backup complete");
}

backup();