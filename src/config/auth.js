/*exporta variaveis para criacao do jwttoken*/
export default {
    secret: process.env.APP_SECRET,
    expiresIn: '7d',
  };