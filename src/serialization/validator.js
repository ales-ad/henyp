const Validator = require('jsonschema').Validator;
const v = new Validator();

const constants = require('./constants');

const validateSchema = function (body, schema) {
   return v.validate(body, schema);
};

exports.validateSchema = validateSchema;

exports.schemaOrdersQuery = {
   id: '/ordersQuery',
   type: 'object',
   properties: {
      symbol: { type: 'string' },
      start: { type: 'integer', minimum: 0 },
      end: { type: 'integer', minimum: 0 },
      offset: { type: 'integer', minimum: 0 },
      limit: { type: 'integer', minimum: 0 },
      sort: { type: 'string', enum: ['asc', 'desc'] }
   }
};

exports.schemaDealsQuery = {
   id: '/dealsQuery',
   type: 'object',
   properties: {
      symbol: { type: 'string' },
      order: { type: 'integer', minimum: 1 },
      start: { type: 'integer', minimum: 0 },
      end: { type: 'integer', minimum: 0 },
      offset: { type: 'integer', minimum: 0 },
      limit: { type: 'integer', minimum: 0 },
      sort: { type: 'string', enum: ['asc', 'desc'] }
   }
};

exports.schemaAccountBalanceHistoryQuery = {
   id: '/accountBalanceHistoryQuery',
   type: 'object',
   properties: {
      start: { type: 'integer', minimum: 0 },
      end: { type: 'integer', minimum: 0 },
      offset: { type: 'integer', minimum: 0 },
      limit: { type: 'integer', minimum: 0 },
      sort: { type: 'string', enum: ['asc', 'desc'] }
   }
};

exports.schemaAccountInfoRequest = {
   id: '/accountInfoRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 }
   },
   required: [
      'request_id'
   ]
};

exports.schemaOrderCreateRequest = {
   id: '/orderCreateRequest',
   type: 'object',
   properties: {
      external_id: { type: 'integer', minimum: 1 },
      position_id: { type: 'integer', minimum: 0 },
      volume: { type: 'number', minimum: 0 },
      price: { type: 'number', minimum: 0 },
      price_trigger: { type: 'number', minimum: 0 },
      price_sl: { type: 'number', minimum: 0 },
      price_tp: { type: 'number', minimum: 0 },
      expiration_time: { type: 'integer', minimum: 0 },
      side: {
         type: 'integer',
         enum: [
            constants.orderSide.ORD_SIDE_BUY,
            constants.orderSide.ORD_SIDE_SELL
         ]
      },
      type: {
         type: 'integer',
         enum: [
            constants.orderType.ORD_TYPE_MARKET,
            constants.orderType.ORD_TYPE_LIMIT,
            constants.orderType.ORD_TYPE_STOP,
            constants.orderType.ORD_TYPE_STOPLIMIT
         ]
      },
      tif: {
         type: 'integer',
         enum: [
            constants.orderTimeInForce.ORDER_TIF_GTC,
            constants.orderTimeInForce.ORDER_TIF_IOC,
            constants.orderTimeInForce.ORDER_TIF_FOK,
            constants.orderTimeInForce.ORDER_TIF_GTD
         ]
      },
      symbol: { type: 'string', maxLength: 32 },
      comment: { type: 'string', maxLength: 32 },
   },
   required: [
      'external_id',
      'position_id',
      'volume',
      'price',
      'price_trigger',
      'price_sl',
      'price_tp',
      'expiration_time',
      'side',
      'type',
      'tif',
      'symbol',
      'comment'
   ]
};

exports.schemaOrderModifyRequest = {
   id: '/orderModifyRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      order_id: { type: 'integer', minimum: 1 },
      price: { type: 'number', minimum: 0 },
      price_trigger: { type: 'number', minimum: 0 },
      price_sl: { type: 'number', minimum: 0 },
      price_tp: { type: 'number', minimum: 0 },
      expiration_time: { type: 'integer', minimum: 0 },
      side: {
         type: 'integer',
         enum: [
            constants.orderSide.ORD_SIDE_BUY,
            constants.orderSide.ORD_SIDE_SELL
         ]
      },
      type: {
         type: 'integer',
         enum: [
            constants.orderType.ORD_TYPE_LIMIT,
            constants.orderType.ORD_TYPE_STOP,
            constants.orderType.ORD_TYPE_STOPLIMIT
         ]
      },
      tif: {
         type: 'integer',
         enum: [
            constants.orderTimeInForce.ORDER_TIF_GTC,
            constants.orderTimeInForce.ORDER_TIF_IOC,
            constants.orderTimeInForce.ORDER_TIF_FOK,
            constants.orderTimeInForce.ORDER_TIF_GTD
         ]
      },
      symbol: { type: 'string', maxLength: 32 },
      comment: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'order_id',
      'price',
      'price_trigger',
      'price_sl',
      'price_tp',
      'expiration_time',
      'side',
      'type',
      'tif',
      'symbol',
      'comment'
   ],
};

exports.schemaOrderCancelRequest = {
   id: '/orderCancelRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      order_id: { type: 'integer', minimum: 1 },
      side: {
         type: 'integer',
         enum: [
            constants.orderSide.ORD_SIDE_BUY,
            constants.orderSide.ORD_SIDE_SELL
         ]
      },
      type: {
         type: 'integer',
         enum: [
            constants.orderType.ORD_TYPE_LIMIT,
            constants.orderType.ORD_TYPE_STOP,
            constants.orderType.ORD_TYPE_STOPLIMIT
         ]
      },
      symbol: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'order_id',
      'side',
      'type',
      'symbol'
   ],
};

exports.schemaOrderMassStatusRequest = {
   id: '/orderMassStatusRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      symbol: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'symbol'
   ]
};

exports.schemaOrderMassCancelRequest = {
   id: '/orderMassCancelRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      symbol: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'symbol'
   ]
};

exports.schemaPositionCloseByRequest = {
   id: '/positionCloseByRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      position_id: { type: 'integer', minimum: 1 },
      positionby_id: { type: 'integer', minimum: 1 },
      symbol: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'positionby_id',
      'position_id',
      'symbol'
   ]
};

exports.schemaPositionModifyRequest = {
   id: '/positionModifyRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      position_id: { type: 'integer', minimum: 1 },
      price_sl: { type: 'number', minimum: 0 },
      price_tp: { type: 'number', minimum: 0 },
      symbol: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'position_id',
      'price_sl',
      'price_tp',
      'symbol'
   ],
};

exports.schemaPositionMassStatusRequest = {
   id: '/positionMassStatusRequest',
   type: 'object',
   properties: {
      request_id: { type: 'integer', minimum: 1 },
      symbol: { type: 'string', maxLength: 32 },
   },
   required: [
      'request_id',
      'symbol'
   ]
};
