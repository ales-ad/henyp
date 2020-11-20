let nodeExternals = require('webpack-node-externals');
module.exports = {
   entry: './src/server.js',
   output: {
      filename: 'server.js'
   },
   target: 'node',
   externals: [nodeExternals()],
   node: {
      __dirname: true
   }
};
