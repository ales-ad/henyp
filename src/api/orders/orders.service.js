const db = require('../../core/db');
const constants = require('../../serialization/constants');

class OrdersService {
   constructor() {
   }

   static async getList(param, account) {
      const limit = param.limit ? Math.max(param.limit, 1000) : 0;
      const offset = param.offset ? param.offset : 0;
      const sort = param.sort ? param.sort : 'asc';

      const query =
         'SELECT o."Order" AS id, ' +
         'o."PositionID" AS position_id, ' +
         'o."PositionByID" AS positionby_id, ' +
         'CASE ' +
         ` WHEN o."Type" = 0 OR o."Type" = 2 OR o."Type" = 4 OR o."Type" = 6 THEN ${constants.orderSide.ORD_SIDE_BUY} ` +
         ` WHEN o."Type" = 1 OR o."Type" = 3 OR o."Type" = 5 OR o."Type" = 7 THEN ${constants.orderSide.ORD_SIDE_SELL} ` +
         'END AS side, ' +
         'CASE ' +
         ` WHEN o."Type" = 0 OR o."Type" = 1 THEN ${constants.orderType.ORD_TYPE_MARKET} ` +
         ` WHEN o."Type" = 2 OR o."Type" = 3 THEN ${constants.orderType.ORD_TYPE_LIMIT} ` +
         ` WHEN o."Type" = 4 OR o."Type" = 5 THEN ${constants.orderType.ORD_TYPE_STOP} ` +
         ` WHEN o."Type" = 6 OR o."Type" = 7 THEN ${constants.orderType.ORD_TYPE_STOPLIMIT} ` +
         ` WHEN o."Type" = 8 THEN ${constants.orderType.ORD_TYPE_CLOSEBY} ` +
         'END AS type, ' +
         'CASE ' +
         ` WHEN o."TypeFill" = 0 THEN ${constants.orderTimeInForce.ORDER_TIF_FOK} ` +
         ` WHEN o."TypeFill" = 1 THEN ${constants.orderTimeInForce.ORDER_TIF_IOC} ` +
         ` WHEN o."TypeTime" = 2 OR o."TypeTime" = 3 THEN ${constants.orderTimeInForce.ORDER_TIF_GTD} ` +
         ` ELSE ${constants.orderTimeInForce.ORDER_TIF_GTC} ` +
         'END AS tif, ' +
         'CASE ' +
         ` WHEN o."State" = 0 THEN ${constants.orderStatus.ORD_STATUS_STARTED} ` +
         ` WHEN o."State" = 1 THEN ${constants.orderStatus.ORD_STATUS_PLACED} ` +
         ` WHEN o."State" = 2 THEN ${constants.orderStatus.ORD_STATUS_CANCELED} ` +
         ` WHEN o."State" = 3 THEN ${constants.orderStatus.ORD_STATUS_PARTIAL} ` +
         ` WHEN o."State" = 4 THEN ${constants.orderStatus.ORD_STATUS_FILLED} ` +
         ` WHEN o."State" = 5 THEN ${constants.orderStatus.ORD_STATUS_REJECTED} ` +
         ` WHEN o."State" = 6 THEN ${constants.orderStatus.ORD_STATUS_EXPIRED} ` +
         ` WHEN o."State" = 7 THEN ${constants.orderStatus.ORD_STATUS_PENDING_ADD} ` +
         ` WHEN o."State" = 8 THEN ${constants.orderStatus.ORD_STATUS_PENDING_MODIFY} ` +
         ` WHEN o."State" = 9 THEN ${constants.orderStatus.ORD_STATUS_PENDING_CANCEL} ` +
         'END AS status, ' +
         'o."VolumeCurrentExt" / 100000000 AS volume_remain, ' +
         'o."VolumeInitialExt" / 100000000 AS volume_initial, ' +
         'o."PriceOrder" AS price, ' +
         'o."PriceTrigger" AS price_trigger, ' +
         'o."PriceSL" AS price_sl, ' +
         'o."PriceTP" AS price_tp, ' +
         'extract(EPOCH FROM o."TimeExpiration") - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS expiration_time, ' +
         'extract(EPOCH FROM o."TimeSetupMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS create_time, ' +
         'extract(EPOCH FROM o."TimeDoneMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS done_time, ' +
         'o."Digits" as digits, ' +
         'o."Symbol" AS symbol, ' +
         'o."Comment" as comment ' +
         'FROM mt5_orders_history o ' +
         ' LEFT JOIN mt5_symbols s ON s."Symbol" = o."Symbol" ' +
         `WHERE o."Login" = ${account} ` +
         'AND s."CalcMode" <> 64 ' +
         (param.symbol ? `AND lower(o."Symbol") = lower('${param.symbol}') ` : '') +
         (param.start ? `AND extract(epoch from o."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) >= ${param.start} ` : '') +
         (param.end ? `AND extract(epoch from o."TimeMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 from mt5_time) <= ${param.end} ` : '') +
         'ORDER BY o."Order" ' + (sort === 'desc' ? 'DESC ' : '') +
         (limit > 0 ? `LIMIT ${limit} ` : '') +
         (offset > 0 ? `OFFSET ${offset}` : '');

      return await db.queryDb(query);
   }

   static async getOne(id, account) {
      let query =
         'SELECT DISTINCT o."Order" AS id, ' +
         'o."PositionID" AS position_id, ' +
         'o."PositionByID" AS positionby_id, ' +
         'CASE ' +
         ` WHEN o."Type" = 0 OR o."Type" = 2 OR o."Type" = 4 OR o."Type" = 6 THEN ${constants.orderSide.ORD_SIDE_BUY} ` +
         ` WHEN o."Type" = 1 OR o."Type" = 3 OR o."Type" = 5 OR o."Type" = 7 THEN ${constants.orderSide.ORD_SIDE_SELL} ` +
         'END AS side, ' +
         'CASE ' +
         ` WHEN o."Type" = 0 OR o."Type" = 1 THEN ${constants.orderType.ORD_TYPE_MARKET} ` +
         ` WHEN o."Type" = 2 OR o."Type" = 3 THEN ${constants.orderType.ORD_TYPE_LIMIT} ` +
         ` WHEN o."Type" = 4 OR o."Type" = 5 THEN ${constants.orderType.ORD_TYPE_STOP} ` +
         ` WHEN o."Type" = 6 OR o."Type" = 7 THEN ${constants.orderType.ORD_TYPE_STOPLIMIT} ` +
         ` WHEN o."Type" = 8 THEN ${constants.orderType.ORD_TYPE_CLOSEBY} ` +
         'END AS type, ' +
         'CASE ' +
         ` WHEN o."TypeFill" = 0 THEN ${constants.orderTimeInForce.ORDER_TIF_FOK} ` +
         ` WHEN o."TypeFill" = 1 THEN ${constants.orderTimeInForce.ORDER_TIF_IOC} ` +
         ` WHEN o."TypeTime" = 2 OR o."TypeTime" = 3 THEN ${constants.orderTimeInForce.ORDER_TIF_GTD} ` +
         ` ELSE ${constants.orderTimeInForce.ORDER_TIF_GTC} ` +
         'END AS tif, ' +
         'CASE ' +
         ` WHEN o."State" = 0 THEN ${constants.orderStatus.ORD_STATUS_STARTED} ` +
         ` WHEN o."State" = 1 THEN ${constants.orderStatus.ORD_STATUS_PLACED} ` +
         ` WHEN o."State" = 2 THEN ${constants.orderStatus.ORD_STATUS_CANCELED} ` +
         ` WHEN o."State" = 3 THEN ${constants.orderStatus.ORD_STATUS_PARTIAL} ` +
         ` WHEN o."State" = 4 THEN ${constants.orderStatus.ORD_STATUS_FILLED} ` +
         ` WHEN o."State" = 5 THEN ${constants.orderStatus.ORD_STATUS_REJECTED} ` +
         ` WHEN o."State" = 6 THEN ${constants.orderStatus.ORD_STATUS_EXPIRED} ` +
         ` WHEN o."State" = 7 THEN ${constants.orderStatus.ORD_STATUS_PENDING_ADD} ` +
         ` WHEN o."State" = 8 THEN ${constants.orderStatus.ORD_STATUS_PENDING_MODIFY} ` +
         ` WHEN o."State" = 9 THEN ${constants.orderStatus.ORD_STATUS_PENDING_CANCEL} ` +
         'END AS status, ' +
         'o."VolumeCurrentExt" / 100000000 AS volume_remain, ' +
         'o."VolumeInitialExt" / 100000000 AS volume_initial, ' +
         'o."PriceOrder" AS price, ' +
         'o."PriceTrigger" AS price_trigger, ' +
         'o."PriceSL" AS price_sl, ' +
         'o."PriceTP" AS price_tp, ' +
         'extract(EPOCH FROM o."TimeExpiration") - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS expiration_time, ' +
         'extract(EPOCH FROM o."TimeSetupMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS create_time, ' +
         'extract(EPOCH FROM o."TimeDoneMsc") * 1000 - (SELECT DISTINCT "TimeZone" * 60 * 1000 FROM mt5_time) AS done_time, ' +
         'o."Digits" as digits, ' +
         'o."Symbol" AS symbol, ' +
         'o."Comment" as comment ' +
         'FROM mt5_orders_history o ' +
         ' LEFT JOIN mt5_symbols s ON s."Symbol" = o."Symbol" ' +
         `WHERE o."Login" = ${account} ` +
         'AND s."CalcMode" <> 64 ' +
         `AND o."Order" = ${id}`;

      const res = await db.queryDb(query);

      if (res && res.length) {
         return res[0];
      }

      return {};
   }
}

module.exports = OrdersService;
