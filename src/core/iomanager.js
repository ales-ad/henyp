const manager = {
   sockets: {},
   ready: false,

   getAllSockets: function () {
      let res = [];

      for (let account in this.sockets) {
         res = [...res, ...this.sockets[account]];
      }

      return res;
   },
   getAccountSockets: function (account) {
      let res = [];

      if (account in this.sockets) {
         res = [...this.sockets[account]];
      }

      return res;
   },
   addSocket: function (uuid, account, socket) {
      if (this.sockets[account]) {
         this.sockets[account] = [
            ...this.sockets[account],
            {
               uuid: uuid,
               socket: socket,
               initialized: false,
            },
         ];
      } else {
         this.sockets[account] = [
            {
               uuid: uuid,
               socket: socket,
               initialized: false,
            },
         ];
      }
   },
   initializeSocket: function (uuid, account) {
      if (account in this.sockets) {
         const index = this.sockets[account]
            .map((item) => {
               return item.uuid;
            })
            .indexOf(uuid);

         this.sockets[account][index].initialized = true;
      }
   },
   removeSocket: function (uuid, account) {
      if (account in this.sockets) {
         const index = this.sockets[account]
            .map((item) => {
               return item.uuid;
            })
            .indexOf(uuid);

         this.sockets[account].splice(index, 1);
      }
   },
};

module.exports = manager;
