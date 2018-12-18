const
  conf = require('./config.js'),
  Jscrape = require('./scrape.js'),
  utils = require('./utils.js');

//SAMPLE USAGE OF JScrape
async function main(headless=true) {
  const secrets = await utils.readSecrets(); 
  const dbData = await utils.connectToData(secrets);

  keysToScrape = ["goguardian", "nuro"];
  for (let i = 0; i < keysToScrape.length; i++) {
    company = keysToScrape[i];
    console.log("Scraping", company);

    let companyDocs = await dbData.find({"company": company}).toArray();
    if(companyDocs.length == 0) {
      try {
        const jscrape = new Jscrape(company, headless, secrets);
        const data = await jscrape.getkeyInfo();
        await dbData.insertOne(data);
      } catch (err) {
        console.log("Failed to scrape", company, "with", err);
      }

      await utils.randomDelay();
      await utils.randomDelay();
    }
  }

}

main(false)
  .then(() => console.log("COMPLETE"))
  .catch(console.error);
