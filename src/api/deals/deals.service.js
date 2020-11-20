const db = require('../../core/db');
const constants = require('../../serialization/constants');

class DealsService {
   constructor() {
   }

   static async getList(param, account) {
      const limit = param.limit ? Math.max(param.limit, 1000) : 0;
      const offset = param.offset ? param.offset : 0;
      const sort = param.sort ? param.sort : 'asc';

      const query =
         'SELECT d."Deal" as id, ' +
         'd."Order" as order_id, ' +
         'd."PositionID" as position_id, ' +
         'CASE' +
         ` WHEN d."Action" = 0 THEN ${constants.dealType.DEAL_TYPE_BUY} ` +
         ` WHEN d."Action" = 1 THEN ${constants.dealType.DEAL_TYPE_SELL} ` +
         'END AS type, ' +
         'CASE' +
         ` WHEN d."Entry" = 0 THEN ${constants.dealDirection.DEAL_DIRECTION_IN} ` +
         ` WHEN d."Entry" = 1 THEN ${constants.dealDirection.DEAL_DIRECTION_OUT} ` +
         ` WHEN d."Entry" = 2 THEN ${constants.dealDirection.DEAL_DIRECTION_INOUT} ` +
         ` WHEN d."Entry" = 3 THEN ${constants.dealDirection.DEAL_DIRECTION_OUTBY} ` +
         'END AS direction, ' +
         'd."VolumeExt" / 100000000 AS volume, ' +
         'd."Price" as price, ' +
         'd."Profit" as profit, ' +
         'd."Commission" as commission, ' +
         'd."Storage" as swap, ' +
         'd."Fee" as fee, ' +
         'extract(epoch from d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) AS create_time, ' +
         'd."Symbol" as symbol, ' +
         'd."Comment" as comment ' +
         'FROM mt5_deals d ' +
         'LEFT JOIN mt5_symbols s ON s."Symbol" = d."Symbol" ' +
         `WHERE d."Login" = ${account} ` +
         'AND s."CalcMode" <> 64 ' +
         (param.symbol ? `AND lower(d."Symbol") = lower('${param.symbol}') ` : '') +
         (param.order ? `AND d."Order" = ${param.order} ` : '') +
         (param.start ? `AND extract(epoch from d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) >= ${param.start} ` : '') +
         (param.end ? `AND extract(epoch from d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) <= ${param.end} ` : '') +
         'ORDER BY d."Deal" ' + (sort === 'desc' ? 'DESC ' : '') +
         (limit > 0 ? `LIMIT ${limit} ` : '') +
         (offset > 0 ? `OFFSET ${offset}` : '');

      return await db.queryDb(query);
   }

   static async getOne(id, account) {
      let query =
         'SELECT DISTINCT d."Deal" as id, ' +
         'd."Order" as order_id, ' +
         'd."PositionID" as position_id, ' +
         'CASE' +
         ` WHEN d."Action" = 0 THEN ${constants.dealType.DEAL_TYPE_BUY} ` +
         ` WHEN d."Action" = 1 THEN ${constants.dealType.DEAL_TYPE_SELL} ` +
         'END AS type, ' +
         'CASE' +
         ` WHEN d."Entry" = 0 THEN ${constants.dealDirection.DEAL_DIRECTION_IN} ` +
         ` WHEN d."Entry" = 1 THEN ${constants.dealDirection.DEAL_DIRECTION_OUT} ` +
         ` WHEN d."Entry" = 2 THEN ${constants.dealDirection.DEAL_DIRECTION_INOUT} ` +
         ` WHEN d."Entry" = 3 THEN ${constants.dealDirection.DEAL_DIRECTION_OUTBY} ` +
         'END AS direction, ' +
         'd."VolumeExt" / 100000000 AS volume, ' +
         'd."Price" as price, ' +
         'd."Profit" as profit, ' +
         'd."Commission" as commission, ' +
         'd."Storage" as swap, ' +
         'd."Fee" as fee, ' +
         'extract(epoch from d."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) AS create_time, ' +
         'd."Symbol" as symbol, ' +
         'd."Comment" as comment ' +
         'FROM mt5_deals d ' +
         'LEFT JOIN mt5_symbols s ON s."Symbol" = d."Symbol" ' +
         `WHERE d."Login" = '${account}' ` +
         'AND s."CalcMode" <> 64 ' +
         `AND d."Deal" = ${id}`;

      const res = await db.queryDb(query);

      if (res && res.length) {
         return res[0];
      }

      return {};
   }
}

module.exports = DealsService;
