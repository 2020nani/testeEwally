/*configura variaveis de ambiente para teste e desenvolvimento*/
const dotenv =require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV==="test" ? 'test.env' : '.env'

})