module.exports = function(sequelize, Sequelize){

  return sequelize.define('Bid', {
    symbol: Sequelize.STRING,
    price: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    buyer: Sequelize.STRING,
    order_placed_at: Sequelize.DATE,
    matched: Sequelize.BOOLEAN
  },{
    paranoid: true
  });

}
