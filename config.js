const
  C = require('./constants.js'),
  Glassdoor = require('./scrappers/glassdoor.js'); //SAMPLE
  
module.exports = {
  //Key(string name), the scrappers class, and the version
  SCRAPPERS: [
    [C.GLASSDOOR, Glassdoor, 1], //SAMPLE
  ],
}