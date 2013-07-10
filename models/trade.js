module.exports = function(sequelize, Sequelize){

  return sequelize.define('Trade', {
    symbol: Sequelize.STRING,
    price: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    buyer: Sequelize.STRING,
    bid: Sequelize.STRING,
    seller: Sequelize.STRING,
    ask: Sequelize.STRING
  },{
    paranoid: true
  });

}
