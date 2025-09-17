// Exports available strategies. 
// Currently it exports a default strategy (random variant selection) but can be extended with other strategies.

const basicRandomStrategy = require('./basicRandomStrategy');

module.exports = {
  default: basicRandomStrategy,
  basicRandomStrategy,
};
