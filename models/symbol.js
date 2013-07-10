module.exports = function(sequelize, Sequelize){

  return sequelize.define('Symbol', {
    symbol: { type: Sequelize.STRING, unique: true },
    price: Sequelize.FLOAT,
    issued: Sequelize.INTEGER
  },{
    paranoid: true,
    instanceMethods: {
      market_cap: function(){
        return (this.price * this.issued);
      }
    }
  });

}
