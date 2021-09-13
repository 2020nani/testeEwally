/*exporta variaveis de test e desenvolvimento para acesso ao database*/
require('../bootstrap');
console.log(process.env.NODE_ENV)
module.exports = {
  host: process.env.DB_HOST ,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || 'postgres',
  storage: './__tests__/database.sqlite',
  logging: false,
  ssl:  process.env.SSL_DB || false,
  dialectOptions: {
            ssl:  process.env.SSL_DB || false
        },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },

};
