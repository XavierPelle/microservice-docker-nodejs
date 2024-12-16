import { Router } from 'express';
import * as controller from '../controller/cart.controller';

const router: Router = Router();

router.get('/', controller.getAll);
router.post('/create', controller.createCart);
router.put('/update/:id', controller.updateCart);
router.delete('/delete/:id', controller.deleteCart);

export default router;
