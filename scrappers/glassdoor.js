//SAMPLE Scrapper, feel free to delete 

const
  puppeteer = require('puppeteer'),
  Scrapper = require('./base.js'),
  utils = require('../utils.js');

const GLASSDOOR_BASE_URL = "https://www.glassdoor.com/";

//TODO: Scrape Glassdoor way better adding mission and url 
module.exports = class Glassdoor extends Scrapper{
  constructor(company, headless, secrets) {
    super(company, headless, secrets);
    this.data= {'glassdoor_rating': {}};
  }
  
  async scrape() {
    await this.setup();
    await this.getToReviewPage();
    await this.getRatings();

    await utils.randomDelay();
    await this.close();
    return this.data;
  }

  //must be run on review page
  async login() {
    await utils.randomDelay();
    await this.page.waitForSelector('.ratingNum'); //must be run on review page cuz this
    await this.page.evaluate(() => {
      document.querySelector('a.sign-in').click();
    });

    await utils.randomDelay();
    const usernameS = "#LoginModal > div > div > div.signInModal.modalContents > div.signin > div:nth-child(4) > div.emailSignInForm > form > div:nth-child(3) > div > input";
    await this.page.waitForSelector(usernameS);
    await this.page.type(usernameS, this.secrets['username'], {delay: 54});

    await utils.randomDelay();
    const passwordS = '#LoginModal > div > div > div.signInModal.modalContents > div.signin > div:nth-child(4) > div.emailSignInForm > form > div:nth-child(4) > div > input';
    await this.page.type(passwordS, this.secrets['password'], {delay: 79});

    await utils.randomDelay();
    const loginButtonS = '#LoginModal > div > div > div.signInModal.modalContents > div.signin > div:nth-child(4) > div.emailSignInForm > form > button';
    await this.page.click(loginButtonS);
  }

  async getToReviewPage() {
    await this.page.goto(GLASSDOOR_BASE_URL);

    const searchS ='#KeywordSearch';
    await this.page.waitForSelector(searchS);
    await this.page.evaluate(() => {
      const choices = document.querySelector('.context-choice-tabs-box');
      const companiesTab = choices.querySelectorAll('li')[1];
      companiesTab.click();
    });

    await utils.randomDelay();
    await this.page.type(searchS, this.company, {delay: 59});

    await utils.randomDelay();
    const searchButtonS ='#HeroSearchButton';
    await this.page.click(searchButtonS);

    await this.page.waitForNavigation();

    //For some reason, the search/company often opens in a new tab
    const pages = await this.browser.pages();
    this.page = pages[pages.length - 1]; //most recently opened

    //It can go straight to company page or to search, but either way the code works :0
    await utils.randomDelay();
    //Choose the first review box to click, in search will be the first search result
    await this.page.evaluate(() => {
      document.querySelector('a.eiCell.cell.reviews').click();
    });
  }

  //TODO: filter to fulltime, add check for secrets
  async getRatings() {
    await this.page.waitForSelector('.ratingNum');
    this.data['glassdoor_rating']['total'] = await this.page.evaluate(() => document.querySelector('.ratingNum').innerText);

    //the login and filtering is pretty shaky
    try {
      await this.login();

      await utils.randomDelay();
      //click filter arrow down
      const filterArrow = '#MainCol > div.module.filterableContents > div.eiFilter > div.noPadLt > div.hideHH.curFilters > span.gdSelect.margRtSm > p > span.arrowDown';
      await this.page.click(filterArrow);

      await utils.randomDelay();
      await this.page.type('#FilterJobTitle', 'software', {delay: 97});

      await utils.randomDelay();
      const filterButton = '#FilterButtons > div.ib.applyBtn > button';
      await this.page.click(filterButton);

      await this.page.waitForSelector('.ratingNum');
      this.data['glassdoor_rating']['software'] = await this.page.evaluate(() => document.querySelector('.ratingNum').innerText);
    } catch(err) {
      console.log("NOT FATAL ERROR, but couldn't get engineer specific ratings:", err);
    }
  }

}
