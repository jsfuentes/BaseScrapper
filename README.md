# Base Scrapper 
This base scrapper includes:
- puppeteer 
- base scrapper class
- many scrappers for a single name/key 
- gracefully handles scrapper failures 
- support for mongodb_uri
- backfill script 
- backup script
- constants and config file 
- Sample secrets.json 
- Sample glassdoor scrapping usage

## Add new scrappers
1) Add scrapper in scrappers that extends Scrape class and implements scrape ft 
  - this should use the key to know what to do 
2) Add under SCRAPPERS list in config.js 
3) Your scrapper will be called with all the keys given in main.js 

