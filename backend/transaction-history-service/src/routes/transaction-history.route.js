const { Router } = require('express');
const controller = require("../controller/transaction-history.controller");

const router = Router();

router.get("/", controller.getAll);
router.post("/create", controller.createTransaction);

module.exports = router;