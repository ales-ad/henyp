const logger = require('./utils/logger');
const config = require('./config');

const httpserver = require('./app');
const wsserver = require('./io');
const zmq = require('./zmq');

zmq.monitor();
zmq.connect(`tcp://${config.zmq.address}`);

httpserver.listen(config.http.port, config.http.host, () => {
   logger.info(`HTTP server is running: http://${config.http.host}:${config.http.port}`);
});

wsserver.listen(config.ws.port, config.ws.host, () => {
   logger.info(`WebSocket server is running: http://${config.ws.host}:${config.ws.port}`);
});
