import { Router } from 'express';
export const router = Router();

import { mainController } from '../controllers/mainController.js';
import { listController } from '../controllers/listController.js';

import { controllerWrapper as cw } from './controllerWrapper.js';

router.get('/', mainController.index);
router.get('/lists', cw(listController.index));
router.get('/lists/:id(\\d+)', cw(listController.show));
router.post('/lists', cw(listController.store));
router.patch('/lists/:id(\\d+)', cw(listController.update));
router.delete('/lists/:id(\\d+)', cw(listController.destroy));
