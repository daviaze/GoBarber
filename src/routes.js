import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController'
const routes = new Router();

import authMiddleware from './app/middlewares/auth'


routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware) // irá passar a configuração de autenticação (token) somente para a rota de update, ou seja, somente poderá acessar a rota se tiver o token

routes.put('/users', UserController.update);

export default routes;