const path = require('path');

let dataFilePath = path.resolve(path.join(__dirname, '../demo/demo.data.js'));

delete require.cache[dataFilePath];

let data = require(dataFilePath);

data.content = "body";

module.exports = {
  deps: [dataFilePath],
  data: data
};
