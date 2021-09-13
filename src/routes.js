import { Router } from 'express';
import UserController from './app/controllers/UserController';
import BoletoController from './app/controllers/BoletoController';
import SessionController from './app/controllers/SessionController';
import SwaggerUi from 'swagger-ui-express';
import SwwagerDocs from '../swagger.json'
import authMiddleware from './app/middlewares/auth';


const routes = new Router();
routes.use('/api-docs', SwaggerUi.serve)
routes.get('/api-docs', SwaggerUi.setup(SwwagerDocs))
routes.post('/login', SessionController.store);
routes.post('/users', UserController.store);
routes.get('/boleto/:linha_digitavel', BoletoController.consultarBoleto)
routes.use(authMiddleware);
/*rotas so serao acessadas com o jwttoken*/
routes.put('/api/v1/users/:user_id', UserController.update);
routes.delete('/api/v1/users/:user_id', UserController.delete);


module.exports = routes;