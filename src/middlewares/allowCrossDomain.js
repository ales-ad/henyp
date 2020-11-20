module.exports = function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,POST');
   res.header('Access-Control-Allow-Headers', 'Origin,  Authorization');

   next();
};
