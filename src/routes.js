import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth'
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

const routes = new Router();
const upload = multer(multerConfig)



routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware) // irá passar a configuração de autenticação (token) somente para a rota de update e as demais, ou seja, somente poderá acessar a rota se tiver o token

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.get('/appointments', AppointmentController.index)

routes.post('/appointments', AppointmentController.store)

routes.get('/schedule', ScheduleController.index)

routes.post('/files', upload.single('file'), FileController.store);

export default routes;