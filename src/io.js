const fs = require('fs');
const socketio = require('socket.io');
const socketioJwt = require('socketio-jwt');
const http = require('http');

const config = require('./config');
const zmq = require('./zmq');

let logger = require('./utils/logger');
let helpers = require('./utils/helpers');
const iomanager = require('./core/iomanager');
const validator = require('./serialization/validator');
const constants = require('./serialization/constants');
const messages = require('./serialization/serialization_pb');

const server = http.createServer();
const io = socketio(server);

const publicKey = fs.readFileSync(config.jwt.secret, 'utf8');

function zmqSendRequest(type, request) {
   let wrapper = new messages.RequestWrapper();

   wrapper.setType(type);
   wrapper.setData(request.serializeBinary());

   zmq.send(Buffer.from(wrapper.serializeBinary()));
}

function ioSendIncorrectFormatMessage(uuid, socket, res) {
   let errors = [];

   res.errors.forEach((_error) => {
      errors.push(_error.stack);
   });

   const json = JSON.stringify({
      code: constants.errorType.ERR_INCORRECT_FORMAT,
      errors: [...errors]
   });

   socket.emit(constants.messageType.MSG_ERROR, json);
   logger.debug(`${uuid} < ${constants.messageType.MSG_ERROR}, ${json}`);
}

io.sockets.on('connection', socketioJwt.authorize({
   secret: publicKey,
   timeout: 5000,
   issuer: config.jwt.issuer,
   audience: config.jwt.audience,
}));

io.sockets.on('authenticated', (socket) => {
   const uuid = helpers.uuid();
   const address = socket.handshake.address;
   const account = socket.decoded_token.account;

   if (!account || account <= 0) {
      logger.warn(`Socket connection refused: ${address} - invalid account number`);

      socket.disconnect(true);
      return;
   }

   if (!iomanager.ready) {
      logger.warn(`Socket connection refused: ${address} - service unavailable`);

      socket.disconnect(true);
      return;
   }

   logger.info(`${uuid}: connected (${address}, account: ${account})`);
   iomanager.addSocket(uuid, account, socket);

   socket.on('disconnect', (reason) => {
      logger.info(`${uuid}: disconnected [${reason}]`);
      iomanager.removeSocket(uuid, account, socket);
   });

   socket.on(constants.requestType.REQ_ACCOUNT_INFO, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaAccountInfoRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_ACCOUNT_INFO}, ${json}`);

         iomanager.initializeSocket(uuid, account);

         let request = new messages.AccountInfoRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_ACCOUNT_INFO, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_ORDER_CREATE, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaOrderCreateRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_ORDER_CREATE}, ${json}`);

         let request = new messages.OrderCreateRequest();
         request.setAccount(account);
         request.setExternalid(data.external_id);
         request.setPositionid(data.position_id);
         request.setVolume(data.volume);
         request.setPrice(data.price);
         request.setPricetrigger(data.price_trigger);
         request.setPricetp(data.price_sl);
         request.setPricesl(data.price_tp);
         request.setExpirationtime(data.expiration_time);
         request.setSide(data.side);
         request.setType(data.type);
         request.setTimeinforce(data.tif);
         request.setSymbol(data.symbol);
         request.setComment(data.comment);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_ORDER_CREATE, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_ORDER_MODIFY, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaOrderModifyRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_ORDER_MODIFY}, ${json}`);

         let request = new messages.OrderModifyRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setOrderid(data.order_id);
         request.setPrice(data.price);
         request.setPricetrigger(data.price_trigger);
         request.setPricetp(data.price_sl);
         request.setPricesl(data.price_tp);
         request.setExpirationtime(data.expiration_time);
         request.setSide(data.side);
         request.setType(data.type);
         request.setTimeinforce(data.tif);
         request.setSymbol(data.symbol);
         request.setComment(data.comment);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_ORDER_MODIFY, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_ORDER_CANCEL, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaOrderCancelRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_ORDER_CANCEL}, ${json}`);

         let request = new messages.OrderCancelRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setOrderid(data.order_id);
         request.setSide(data.side);
         request.setType(data.type);
         request.setSymbol(data.symbol);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_ORDER_CANCEL, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_ORDER_MASS_CANCEL, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaOrderMassCancelRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_ORDER_MASS_CANCEL}, ${json}`);

         let request = new messages.OrderMassCancelRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setSymbol(data.symbol);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_ORDER_MASS_CANCEL, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_ORDER_MASS_STATUS, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaOrderMassStatusRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_ORDER_MASS_STATUS}, ${json}`);

         let request = new messages.OrderMassStatusRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setSymbol(data.symbol);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_ORDER_MASS_STATUS, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_POSITION_MODIFY, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaPositionModifyRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_POSITION_MODIFY}, ${json}`);

         let request = new messages.PositionModifyRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setPositionid(data.position_id);
         request.setPricetp(data.price_sl);
         request.setPricesl(data.price_tp);
         request.setSymbol(data.symbol);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_POSITION_MODIFY, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_POSITION_CLOSEBY, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaPositionCloseByRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_POSITION_CLOSEBY}, ${json}`);

         let request = new messages.PositionCloseByRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setPositionid(data.position_id);
         request.getPositionbyid(data.positionby_id);
         request.setSymbol(data.symbol);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_POSITION_CLOSEBY, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });

   socket.on(constants.requestType.REQ_POSITION_MASS_STATUS, (json) => {
      const data = JSON.parse(json);
      const res = validator.validateSchema(data, validator.schemaPositionMassStatusRequest);

      if (res.valid) {
         logger.debug(`${uuid} > ${constants.requestType.REQ_POSITION_MASS_STATUS}, ${json}`);

         let request = new messages.PositionMassStatusRequest();
         request.setAccount(account);
         request.setRequestid(data.request_id);
         request.setSymbol(data.symbol);

         zmqSendRequest(messages.RequestWrapper.RequestType.REQ_POSITION_MASS_STATUS, request);
      } else {
         ioSendIncorrectFormatMessage(uuid, socket, res);
      }
   });
});

module.exports = server;
