const AccountService = require('./account.service');
const validator = require('../../serialization/validator');

exports.getBalanceHistory = async (req, res) => {
   const result = validator.validateSchema(req.query, validator.schemaAccountBalanceHistoryQuery);

   if (result.valid) {
      const data = await AccountService.getBalanceHistory(req.query, req.user.account);
      res.status(200).json(data);
   } else {
      res.status(400);
   }
};

