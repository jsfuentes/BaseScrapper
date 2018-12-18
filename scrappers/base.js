const
  puppeteer = require('puppeteer');
    
module.exports = class Scrapper {
  constructor(company, headless, secrets) {
    this.company = company;
    this.secrets = secrets;
    this.headless = headless;
  }
  
  async setup() {
    this.browser = await puppeteer.launch({headless: this.headless});
    this.page = await this.browser.newPage();
    //not sure if below works actually...
    await this.page.on('console', msg => {
      for (let i = 0; i < msg.args.length; ++i)
        console.log(`${i}: ${msg.args[i]}`);
    });
    this.page.setDefaultNavigationTimeout(60000); //increase timeout to 1 minutes
  }
  
  async scrape() {
   throw new Error('You have to implement the method scrape!');
  }
  
  async close() {
    await this.browser.close();
  }  
  
  async scrollPage() {
    await this.page.evaluate(_ => {
      window.scrollBy({left: 0, top: window.innerHeight, behavior: 'smooth'});
    });
  }
}