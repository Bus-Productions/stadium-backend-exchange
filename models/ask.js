module.exports = function(sequelize, Sequelize){

  return sequelize.define('Ask', {
    symbol: Sequelize.STRING,
    price_ordered: Sequelize.FLOAT,
    price_actual: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    seller: Sequelize.STRING,
    order_placed_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    price_affecting: Sequelize.BOOLEAN,
    matched: Sequelize.BOOLEAN
  },{
    paranoid: true
  });

}
