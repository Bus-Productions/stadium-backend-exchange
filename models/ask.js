module.exports = function(sequelize, Sequelize){

  return sequelize.define('Ask', {
    symbol: Sequelize.STRING,
    price: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    seller: Sequelize.STRING,
    order_placed_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    matched: Sequelize.BOOLEAN
  },{
    paranoid: true
  });

}
