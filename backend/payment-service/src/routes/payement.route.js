const { Router } = require('express');
const controller = require("../controller/payement.controller");

const router = Router();

router.post('/', controller.createPayment);
router.get('/user/:user_id', controller.getPaymentsByUser);

module.exports = router;