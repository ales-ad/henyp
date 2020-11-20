const fs = require('fs');
const express = require('express');
const expressJwt = require('express-jwt');

const config = require('./config');
const rootRouter = require('./routes');
const allowCrossDomain = require('./middlewares/allowCrossDomain');
const constants = require('./serialization/constants');

const app = express();
const publicKey = fs.readFileSync(config.jwt.secret, 'utf8');

app.use(allowCrossDomain);

app.use(expressJwt({
   secret: publicKey,
   algorithms: ['RS256'],
}));

app.use((err, req, res, next) => {
   if (err.name === 'UnauthorizedError') {
      res.status(err.status).send({
         code: constants.errorType.ERR_UNAUTHORIZED,
         errors: [err.message]
      });

      return;
   }

   next();
});

app.use(rootRouter);

module.exports = app;
