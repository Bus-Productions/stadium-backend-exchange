module.exports = function(sequelize, Sequelize){

  return sequelize.define('Bid', {
    symbol: Sequelize.STRING,
    price_ordered: Sequelize.FLOAT,
    price_actual: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    buyer: Sequelize.STRING,
    order_placed_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    price_affecting: Sequelize.BOOLEAN,
    matched: Sequelize.BOOLEAN
  },{
    paranoid: true
  });

}
