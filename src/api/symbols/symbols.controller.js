const SymbolsService = require('./symbols.service');

exports.getList = async (req, res) => {
   const data = await SymbolsService.getList(req.user.account);
   res.status(200).json(data);
};
