const
  fs = require('fs'),
  MongoClient = require('mongodb').MongoClient,
  util = require('util');


function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

//CONFIG THE VALUE FOR THIS DELAY 
function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.floor(Math.random() * 4000) + 777);
  });
}

async function readSecrets() {
  // Convert fs.readFile into Promise version of same
  const readFile = util.promisify(fs.readFile);
  const data = await readFile('secrets.json');
  return JSON.parse(data);
}

async function connectToDB(secrets, name) {
  const db = await MongoClient.connect(secrets['db_uri'], { useNewUrlParser: true });

  const dbo = db.db("companies");
  return dbo.collection(name);
}

//YES I AM NO COMBINING THESE FUNCTION, WHY? YOU WOULD HAVE TO MAKE A CONSTANT RIGHT, WELL THE CONSTANT IS THIS FUNCTION. DRY ISNT GOD
async function connectToData(secrets) {
  return connectToDB(secrets, 'data');
}

async function connectToSanitizedData(secrets) {
  return connectToDB(secrets, 'sanitized_data');
}

async function connectToBackup(secrets) {
  return connectToDB(secrets, 'backup');
}

function moneyToNumber(moneyStr) {
  return parseInt(moneyStr.replace(/[^0-9.-]+/g, ''));
}

module.exports = {delay, randomDelay, readSecrets, connectToData, connectToSanitizedData, connectToBackup, moneyToNumber};
