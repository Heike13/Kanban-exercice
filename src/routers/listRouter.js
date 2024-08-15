import { Router } from 'express';
import { mainController } from '../controllers/mainController.js';
import { listController } from '../controllers/listController.js';

export const router = Router();

router.get('/', mainController.index);
router.get('/lists', listController.index);
router.get('/lists/:id(\\d+)', listController.show);
router.post('/lists', listController.store);
router.patch('/lists/:id(\\d+)', listController.update);
router.delete('/lists/:id(\\d+)', listController.destroy);
