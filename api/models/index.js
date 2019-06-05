const _ = require('lodash');
const path = require('path');
const database = require('../../config/database');

const Models = {
  Project: require(path.resolve( __dirname, "./project.js" ))
};

// { force: true } - TO REMOVE ROW
database.db.sync();
  // .then(function () {
  //   console.log('Migration completed.');
  //   return Promise.resolve();
  // });