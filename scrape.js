const
  conf = require('./config.js'),
  C = require('./constants.js'),
  utils = require('./utils.js');
  
module.exports = class Jscrape {
  constructor(key, headless, secrets) {
    this.fails = {};
    this.wins = {};
    this.key = key;
    this.headless = headless;
    this.secrets = secrets;
    this.allInfo = {};
  }
  
  async getkeyInfo(toScrape=[C.SCRAPE_ALL]) {
    for(let i = 0; i < conf.SCRAPPERS.length; i++) {
      let scrapeDef = conf.SCRAPPERS[i];
      let scrapeName = scrapeDef[0];
      let scrapeClass = scrapeDef[1];
      let scrapeVersion = scrapeDef[2];
      
      //TODO: Find a way to do this in parallel with promises
      if(toScrape[0] === C.SCRAPE_ALL || toScrape.indexOf(scrapeName) != -1) {
        await this.scrape(scrapeName, scrapeClass, scrapeVersion);
      }
    }
    
    this.allInfo = {
      "key": this.key,
      "fails": this.fails,
      "wins": this.wins,
      ...this.allInfo 
    }
    
    console.log(this.allInfo);
    return this.allInfo;
  }
  
  //collects wins, fails, and info 
  async scrape(scrapeName, scrapeClass, scrapeVersion) {
    const scrapper = new scrapeClass(this.key, this.headless, this.secrets[scrapeName]);
    //TODO: Add date scrapped to dict
    try {
      let data = await scrapper.scrape();
      this.wins[scrapeName] = scrapeVersion;
      this.allInfo = {
        ...this.allInfo,
        ...data
      }
    } catch (err) {
      console.log("Error scrapping", scrapeName, ":", err);
      this.fails[scrapeName] = scrapeVersion;
      await scrapper.close();
    }
  }
  
}
