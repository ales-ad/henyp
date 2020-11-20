const OrdersService = require('./orders.service');
const validator = require('../../serialization/validator');

exports.getOne = async (req, res) => {
   if (req.params.id) {
      const data = await OrdersService.getOne(req.params.id, req.user.account);
      res.status(200).json(data);
   } else {
      res.status(404);
   }
};

exports.getList = async (req, res) => {
   const result = validator.validateSchema(req.query, validator.schemaOrdersQuery);

   if (result.valid) {
      const data = await OrdersService.getList(req.query, req.user.account);
      res.status(200).json(data);
   } else {
      res.status(400);
   }
};

