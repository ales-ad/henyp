const express = require('express');
const rootRouter = express.Router();

const dealsRoutes = require('../api/deals/deals.route');
const ordersRoutes = require('../api/orders/orders.route');
const symbolRoutes = require('../api/symbols/symbols.route');
const accountRoutes = require('../api/account/account.route');

rootRouter.use('/api', dealsRoutes);
rootRouter.use('/api', ordersRoutes);
rootRouter.use('/api', symbolRoutes);
rootRouter.use('/api', accountRoutes);

rootRouter.get('/*', function (req, res) {
   res.status(404).send();
});

module.exports = rootRouter;
