module.exports = function(sequelize, Sequelize){

  return sequelize.define('User', {
    email: {
      type: Sequelize.STRING,
      validate: { isEmail: { msg: 'You must enter a valid email.' } }
    },
    password: Sequelize.STRING,
    admin: Sequelize.BOOLEAN
  },{
    paranoid: true
  });

}
