exports.requestType = {
   REQ_ORDER_CREATE: 'req_order_create',
   REQ_ORDER_MODIFY: 'req_order_modify',
   REQ_ORDER_CANCEL: 'req_order_cancel',
   REQ_ORDER_MASS_CANCEL: 'req_order_mass_cancel',
   REQ_ORDER_MASS_STATUS: 'req_order_mass_status',
   REQ_POSITION_MODIFY: 'req_position_modify',
   REQ_POSITION_CLOSEBY: 'req_position_closeby',
   REQ_POSITION_MASS_STATUS: 'req_position_mass_status',
   REQ_ACCOUNT_INFO: 'req_account_info'
};

exports.messageType = {
   MSG_ERROR: 'msg_error',
   MSG_ORDER_CREATED: 'msg_order_created',
   MSG_ORDER_UPDATED: 'msg_order_updated',
   MSG_ORDER_DELETED: 'msg_order_deleted',
   MSG_ORDER_MASS_STATUS: 'msg_order_mass_status',
   MSG_ORDER_CREATE_REJECTED: 'msg_order_create_rejected',
   MSG_ORDER_MODIFY_REJECTED: 'msg_order_modify_rejected',
   MSG_ORDER_CANCEL_REJECTED: 'msg_order_cancel_rejected',
   MSG_POSITION_CREATED: 'msg_position_created',
   MSG_POSITION_UPDATED: 'msg_position_updated',
   MSG_POSITION_DELETED: 'msg_position_deleted',
   MSG_POSITION_MASS_STATUS: 'msg_position_mass_status',
   MSG_POSITION_MODIFY_REJECTED: 'msg_position_modify_rejected',
   MSG_POSITION_CLOSEBY_REJECTED: 'msg_position_closeby_rejected',
   MSG_DEAL_CREATED: 'msg_deal_created',
   MSG_ACCOUNT_INFO: 'msg_account_info',
   MSG_ACCOUNT_BALANCE_UPDATED: 'msg_account_balance_updated'
};

exports.errorType = {
   ERR_UNAUTHORIZED: 'ERR_UNAUTHORIZED',
   ERR_INCORRECT_FORMAT: 'ERR_INCORRECT_FORMAT',
   ERR_INCORRECT_REQUEST: 'ERR_INCORRECT_REQUEST'
};

exports.orderSide = {
   ORD_SIDE_BUY: 1,
   ORD_SIDE_SELL: 2
};

exports.orderType = {
   ORD_TYPE_MARKET: 1,
   ORD_TYPE_LIMIT: 2,
   ORD_TYPE_STOP: 3,
   ORD_TYPE_STOPLIMIT: 4,
   ORD_TYPE_CLOSEBY: 5
};

exports.orderTimeInForce = {
   ORDER_TIF_GTC: 1,
   ORDER_TIF_IOC: 2,
   ORDER_TIF_FOK: 3,
   ORDER_TIF_GTD: 4
};

exports.orderStatus = {
   ORD_STATUS_STARTED: 1,
   ORD_STATUS_PLACED: 2,
   ORD_STATUS_CANCELED: 3,
   ORD_STATUS_PARTIAL: 4,
   ORD_STATUS_FILLED: 5,
   ORD_STATUS_REJECTED: 6,
   ORD_STATUS_EXPIRED: 7,
   ORD_STATUS_PENDING_ADD: 8,
   ORD_STATUS_PENDING_MODIFY: 9,
   ORD_STATUS_PENDING_CANCEL: 10,
};

exports.positionType = {
   POS_TYPE_BUY: 1,
   POS_TYPE_SELL: 2
};

exports.dealType = {
   DEAL_TYPE_BUY: 1,
   DEAL_TYPE_SELL: 2
};

exports.dealDirection = {
   DEAL_DIRECTION_IN: 1,
   DEAL_DIRECTION_OUT: 2,
   DEAL_DIRECTION_INOUT: 3,
   DEAL_DIRECTION_OUTBY: 4
};

exports.accountBalanceOpType = {
   BALANCE_DEPOSIT: 1,
   BALANCE_WITHDRAWAL: 2
};