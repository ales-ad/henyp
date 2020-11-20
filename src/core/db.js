const pg = require('pg');
const types = pg.types;

const config = require('../config');

const client = new pg.Client({
   host: config.db.host,
   user: config.db.login,
   password: config.db.password,
   database: config.db.name,
});

types.setTypeParser(1700, parseFloat); // NUMERIC
client.connect();

const queryDb = function (query) {
   return new Promise(function (resolve, reject) {
      client.query(query, function (err, result) {
         let res = true;

         if (err) {
            res = [];
         } else {
            if (result.rowCount > 0) {
               return resolve(result.rows);
            } else {
               res = [];
            }
         }

         return resolve(res);
      });
   });
};

exports.queryDb = queryDb;
