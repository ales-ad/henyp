## Installation
1. Run `npm install`
2. Run `git clone https://github.com/JustinTulloss/zeromq.node.git node_modules/zeromq.node`
3. Run `cd node_modules/zeromq.node && npm install`
4. Create and configure `.env` file
5. Run `npm start`
6. Run `npm run build` 
## Installation



## Constants
```
orderSide = {
   ORD_SIDE_BUY: 1,
   ORD_SIDE_SELL: 2
};

orderType = {
   ORD_TYPE_MARKET: 1,
   ORD_TYPE_LIMIT: 2,
   ORD_TYPE_STOP: 3,
   ORD_TYPE_STOPLIMIT: 4,
   ORD_TYPE_CLOSEBY: 5
};

orderTimeInForce = {
   ORDER_TIF_GTC: 1,
   ORDER_TIF_IOC: 2,
   ORDER_TIF_FOK: 3,
   ORDER_TIF_GTD: 4
};

orderStatus = {
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

positionType = {
   POS_TYPE_BUY: 1,
   POS_TYPE_SELL: 2
};

dealType = {
   DEAL_TYPE_BUY: 1,
   DEAL_TYPE_SELL: 2
};

dealDirection = {
   DEAL_DIRECTION_IN: 1,
   DEAL_DIRECTION_OUT: 2,
   DEAL_DIRECTION_INOUT: 3,
   DEAL_DIRECTION_OUTBY: 4
};

accountBalanceOpType = {
   BALANCE_DEPOSIT: 1,
   BALANCE_WITHDRAWAL: 2
};
```

## HTTP API
1. All requests must contain "Authorization" header ("Bearer <JWT_TOKEN>").
2. The JWT token must contain a custom "account" field with the MT5 client's login.

##### Get deal by ID:
```
GET /api/deals/10000001
```
```
{
    "id": 10000001,
    "order_id": 20000001,
    "position_id": 10000701,
    "type": 2,
    "direction": 2,
    "volume": 8,
    "price": 1.18259,
    "profit": -56,
    "commission": 0,
    "swap": 0,
    "fee": 0,
    "create_time": 1600358099984,
    "symbol": "EURUSD",
    "comment": ""
}
```

##### Get deals list:
```
GET /api/deals?order=20000001&symbol=EURUSD&start=1577836800000&end=1600387200000&offset=0&limit=1000&sort=asc
```
```
[
    {
        <fields as described above>
    }
]
```

##### Get history order by ID:
```
GET /api/orders/20000001
```
```
{
    "id": 10000001,
    "position_id": 10000701,
    "positionby_id": 0,
    "side": 2,
    "type": 1,
    "tif": 2,
    "status": 5,
    "volume_remain": 0,
    "volume_initial": 8,
    "price": 0,
    "price_trigger": 0,
    "price_sl": 0,
    "price_tp": 0,
    "expiration_time": 0,
    "create_time": 1600358099984,
    "done_time": 1600358099984,
    "digits": 5,
    "symbol": "EURUSD",
    "comment": ""
}
```

##### Get history (archived) orders list:
```
GET /api/orders?symbol=EURUSD&start=1577836800000&end=1600387200000&offset=0&limit=1000&sort=asc
```
```
[
    {
        <fields as described above>
    }
]
```

##### Get available symbols list:
```
GET /api/symbols
```
```
[
    {
        "name": "EURUSD",
        "group": "FOREX",
        "currency_base": "EUR",
        "currency_profit": "USD",
        "currency_margin": "EUR",
        "volume_min": 0.1,
        "volume_max": 50,
        "volume_step": 0.1,
        "contract_size": 100000,
        "digits": 5
    }
]
```

##### Get account balance operations list:
```
GET /api/account/balance_history?start=1577836800000&end=1600387200000&offset=0&limit=1000&sort=asc
```
```
[
    {
        "id": 10000001,
        "type": 1,
        "amount": 100000,
        "currency": "USD",
        "create_time": 1584884530225,
        "comment": "Initial deposit"
    },
    {
        "id": 10000007,
        "type": 2,
        "amount": 0.01,
        "currency": "USD",
        "create_time": 1577439925917,
        "comment": "Commission #777"
    },
]
```

## WebSocket API

1. All timestamp fields must be always in GMT+0 and UNIX-style format (in seconds: `1600426165`, in milliseconds: `1600426165648`).
2. The JWT token must contain a custom "account" field with the MT5 client's login.
3. Note that `'req_account_info'` request (emit) must be the first message sent after the connection.

Client example:
```
const io = require('socket.io-client');
const socket = io.connect('http://127.0.0.1:5001');

socket.on('connect', function () {
   socket.emit('authenticate', { token: '<JWT_TOKEN>' })
         .on('authenticated', () => {
            socket.on('msg_account_info', function (data) {
               console.log('msg_account_info: ' + data);
            });

            socket.on('msg_order_created', function (data) {
               console.log('msg_order_created: ' + data);
            });

            socket.on('msg_order_updated', function (data) {
               console.log('msg_order_updated: ' + data);
            });

            socket.on('msg_order_deleted', function (data) {
               console.log('msg_order_deleted: ' + data);
            });

            socket.on('msg_position_created', function (data) {
               console.log('msg_position_created: ' + data);
            });

            socket.on('msg_position_updated', function (data) {
               console.log('msg_position_updated: ' + data);
            });
            
            socket.on('msg_position_deleted', function (data) {
               console.log('msg_position_deleted: ' + data);
            });
            
            socket.on('msg_deal_created', function (data) {
               console.log('msg_deal_created: ' + data);
            });

            // other handlers

            // NOTE: this emit must be the first!
            socket.emit('req_account_info', JSON.stringify({ request_id: 12345678 }));
            
            socket.emit('req_order_create', JSON.stringify({
               external_id: 12345678,
               position_id: 0,
               volume: 0.01,
               price: 0,
               price_trigger: 0,
               price_sl: 0,
               price_tp: 0,
               expiration_time: 0,
               side: 1, // buy
               type: 1, // market
               tif: 3, // fok
               symbol: 'EURUSD',
               comment: ''
            }));
         })
         .on('unauthorized', (msg) => {
            throw new Error(msg.data.type);
         });
});
```

Output will be the same:
```
msg_account_info: [1,30,50,100,2,"USD",[[100000,0,2,"USD"]]]
msg_order_created: [68,47,0,0,1,1,3,1,0.01,0.01,0,0,0,0,0,1600431771492,0,5,"EURUSD",""]
msg_position_updated: [66,1,0.03,1.18386,0,0,0,1600426165648,1600431771494,5,"EURUSD",""]
msg_order_deleted: [68,47,66,0,1,1,3,5,0,0.01,0,0,0,0,0,1600431771492,1600431771494,5,"EURUSD",""]
msg_deal_created: [70,68,66,1,1,0.01,1.18361,0,0,0,0,1600431771494,"EURUSD",""]
```

#### Global events:
```
socket.on('msg_error', (data) => {
    /*
    {
        code: 'ERR_INCORRECT_FORMAT',
        errors: [
            '<error details>'
        ]
    }
    */
});
```

#### Account
##### Requests
```
socket.emit('req_account_info', JSON.stringify({
    request_id: 1600169613000,      // must be unique valid uint64 number
}));
```
##### Events
```
socket.on('msg_account_info', (data) => {
    /*
    [
        request_id,                 // uint64
        stopout_level,              // double
        margincall_level,           // double
        leverage,                   // uint32
        digits,                     // uint32
        currency,                   // string
        [
            [
                amount,             // double
                credit,             // double
                digits,             // uint32
                currency            // string
            ],
            ...
        ]
    ]
    */
});

socket.on('msg_account_balance_updated', (data) => {
    /*
    [
        [
            amount,                 // double
            credit,                 // double
            digits,                 // uint32
            currency                // string
        ],
        ...
    ]
    */
});
```

#### Orders
##### Requests
```
socket.emit('req_order_create', JSON.stringify({
    external_id: 1600169613000,       // must be unique valid uint64 number
    position_id: 103423,              // must be valid uint64 number or 0
    volume: 0.01,                     // must be valid positive float number
    price: 1.18951,                   // must be valid positive float number or 0
    price_trigger: 1.19000,           // must be valid positive float number or 0
    price_sl: 1.18900,                // must be valid positive float number or 0
    price_tp: 1.90500,                // must be valid positive float number or 0
    expiration_time: 1600169700,      // must be valid uint64 number or 0 (seconds)
    side: 1,                          // enum: orderSide
    type: 4,                          // enum: orderType
    tif: 4,                           // enum: orderTimeInForce
    symbol: 'EURUSD',                 // max length is 32 letters
    comment: ''                       // max length is 32 letters
}));

socket.emit('req_order_modify', JSON.stringify({
    request_id: 1600169613000,        // must be unique valid uint64 number
    order_id: 103423,                 // must be valid uint64 number
    price: 1.18951,                   // must be valid positive float number or 0
    price_trigger: 1.19000,           // must be valid positive float number or 0
    price_sl: 1.18900,                // must be valid positive float number or 0
    price_tp: 1.90500,                // must be valid positive float number or 0
    expiration_time: 1600169700,      // must be valid uint64 number or 0 (seconds)
    side: 1,                          // enum: orderSide
    type: 4,                          // enum: orderType
    tif: 4,                           // enum: orderTimeInForce
    symbol: 'EURUSD',                 // max length is 32 letters
    comment: ''                       // max length is 32 letters
}));

socket.emit('req_order_cancel', JSON.stringify({
    request_id: 1600169613000,        // must be unique valid uint64 number
    order_id: 103423,                 // must be valid uint64 number
    side: 1,                          // enum: orderSide
    type: 4,                          // enum: orderType
    symbol: 'EURUSD'                  // max length is 32 letters
}));

socket.emit('req_order_mass_cancel', JSON.stringify({
    request_id: 1600169613000,        // must be unique valid uint64 number
    symbol: 'EURUSD'                  // max length is 32 letters
}));

socket.emit('req_order_mass_status', JSON.stringify({
    request_id: 1600169613000,        // must be unique valid uint64 number
    symbol: 'EURUSD'                  // max length is 32 letters
}));
```
##### Events
```
socket.on('msg_order_created', (data) => {
    /*
    [
        order_id,                   // uint64
        external_id,                // uint64
        position_id,                // uint64
        positionby_id,              // uint64
        side,                       // uint32, enum: orderSide
        type,                       // uint32, enum: orderType
        tif,                        // uint32, enum: orderTimeInForce
        status,                     // uint32, enum: orderStatus
        volume_remain,              // double
        volume_initial,             // double
        price,                      // double
        price_trigger               // double
        price_sl,                   // double
        price_tp,                   // double
        expiration_time,            // uint64, seconds
        create_time,                // uint64, milliseconds
        done_time,                  // uint64, milliseconds
        digits,                     // uint32
        symbol,                     // string
        comment                     // string
    ]
    */
});

socket.on('msg_order_updated', (data) => {
    [
        <fields as described above>
    ]
});

socket.on('msg_order_deleted', (data) => {
    [
        <fields as described above>
    ]
});

socket.on('msg_order_mass_status', (data) => {
    /*
    request_id,                     // uint64
    [
        [
            <fields as described above>
        ],
        ...
    ]
    */
});

socket.on('msg_order_create_rejected', (data) => {
    /*
    [
        request_id,                 // uint64
        code                        // uint32, enum: look at MT5 EnMTAPIRetcode
    ]
    */
});

socket.on('msg_order_modify_rejected', (data) => {
    /*
    [
        <fields as described above>
    ]
    */
});

socket.on('msg_order_cancel_rejected', (data) => {
    /*
    [
        <fields as described above>
    ]
    */
});
```

#### Positions
##### Requests:
```
socket.emit('req_position_modify', JSON.stringify({
    request_id: 1600169613000,        // must be unique valid uint64 number
    symbol: 'EURUSD'                  // max length is 32 letters
}));

socket.emit('req_position_closeby', JSON.stringify({
    request_id: 1600169613000,        // must be unique valid uint64 number
    position_id: 10000001,            // must be valid positive uint64 number
    positionby_id: 10000002,          // must be valid positive uint64 number
    symbol: 'EURUSD'                  // max length is 32 letters
}));
```
##### Events:
```
socket.on('msg_position_created', (data) => {
    /*
    [
        position_id,                // uint64
        type,                       // enum: positionType
        volume,                     // double
        open_price,                 // double
        price_sl,                   // double
        price_tp,                   // double
        swap,                       // double
        create_time,                // uint64 (milliseconds)
        update_time,                // uint64 (milliseconds)
        digits,                     // uint32
        symbol,                     // string
        comment                     // string
    ]
    */
});

socket.on('msg_position_updated', (data) => {
    /*
    [
        <fields as described above>
    ]
    */
});

socket.on('msg_position_deleted', (data) => {
    /*
    [
        <fields as described above>
    ]
    */
});

socket.on('msg_position_modify_rejected', (data) => {
    /*
    [
        request_id,                 // uint64
        code                        // uint32, enum: look at MT5 EnMTAPIRetcode
    ]
    */
});

socket.on('msg_position_closeby_rejected', (data) => {
    /*
    [
        request_id,                 // uint64
        code                        // uint32, enum: look at MT5 EnMTAPIRetcode
    ]
    */
});
```

#### Deals
##### Events:
```
socket.on('msg_deal_created', (data) => {
    /*
    [
        deal_id,                    // uint64
        order_id,                   // uint64
        position_id,                // uint64
        type,                       // enum: dealType
        direction,                  // enum: dealDirection
        volume,                     // double
        price,                      // double
        profit,                     // double
        swap,                       // double
        commission,                 // double
        fee,                        // double
        create_time,                // uint64 (milliseconds)
        symbol,                     // string
        comment                     // string
    ]
    */
});
```