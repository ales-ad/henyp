const db = require('../../core/db');
const constants = require('../../serialization/constants');

class AccountService {
   constructor() {
   }

   static async getBalanceHistory(param, account) {
      const limit = param.limit ? Math.max(param.limit, 1000) : 0;
      const offset = param.offset ? param.offset : 0;
      const sort = param.sort ? param.sort : 'asc';

      const query = 'SELECT d."Deal" AS id, ' +
         'CASE ' +
         ` WHEN sign(d."Profit") >= 0 THEN ${constants.accountBalanceOpType.BALANCE_DEPOSIT} ` +
         ` ELSE ${constants.accountBalanceOpType.BALANCE_WITHDRAWAL} ` +
         'END AS type, ' +
         'abs(d."Profit") AS amount, ' +
         'g."Currency" AS currency, ' +
         'extract(EPOCH FROM d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS create_time, ' +
         'd."Comment" AS comment ' +
         'FROM mt5_deals d ' +
         ' LEFT JOIN mt5_users u ON u."Login" = d."Login" ' +
         ' LEFT JOIN mt5_groups g ON g."Group" = u."Group" ' +
         `WHERE d."Login" = ${account} ` +
         'AND d."Action" IN (2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19)' +
         (param.start ? `AND extract(epoch from d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) >= ${param.start} ` : '') +
         (param.end ? `AND extract(epoch from d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) <= ${param.end} ` : '') +
         'ORDER BY d."Deal" ' + (sort === 'desc' ? 'DESC ' : '') +
         (limit > 0 ? `LIMIT ${limit} ` : '') +
         (offset > 0 ? `OFFSET ${offset}` : '');

      return await db.queryDb(query);
   }
}

module.exports = AccountService;
