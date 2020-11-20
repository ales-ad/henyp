const db = require('../../core/db');

class SymbolsService {
   constructor() {
   }

   static async getList(account) {
      let query =
         'SELECT s."Symbol" as name, ' +
         'split_part(s."Path", \'\\\', 1) AS group, ' +
         's."CurrencyBase" as currency_base, ' +
         's."CurrencyProfit" as currency_profit, ' +
         's."CurrencyMargin" as currency_margin, ' +
         's."VolumeMinExt" / 100000000 AS volume_min, ' +
         's."VolumeMaxExt" / 100000000 AS volume_max, ' +
         's."VolumeStepExt" / 100000000 AS volume_step, ' +
         's."ContractSize" as contract_size, ' +
         's."Digits" as digits ' +
         'FROM mt5_symbols s ' +
         'WHERE s."CalcMode" <> 64 ' +
         'ORDER BY s."Symbol"';

      return await db.queryDb(query);
   }
}

module.exports = SymbolsService;
