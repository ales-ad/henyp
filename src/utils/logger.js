const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const config = require('../config');

const customFormat = printf(({ level, message, timestamp }) => {
   return `[${timestamp} ${level}]: ${message}`;
});

const logger = createLogger({
   level: 'debug',
   format: combine(timestamp(), customFormat),
   transports: [
      new transports.Console(),
      new transports.File({
         filename: config.app.log,
         timestamp: true,
         json: true
      })
   ],

   exitOnError: false,
});

module.exports = logger;
