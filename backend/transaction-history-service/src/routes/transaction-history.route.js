const { Router } = require('express');
const controller = require("../controller/transaction-history.controller");

const router = Router();

router.get("/", controller.getAll);
router.post("/create", controller.createTransaction);
router.get('/user/:userId', controller.getTransactionsByUserId);
router.get("/:id", controller.getTransactionById);

module.exports = router;