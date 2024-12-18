const { Router } = require('express');
const controller = require("../controller/product.controller");

const router = Router();

router.get("/", controller.getAll);
router.post("/create", controller.createProduct);
router.put("/update/:id", controller.updateProduct);
router.delete("/delete/:id", controller.deleteProduct);
router.get("/fakedata", controller.createFakeProduct);


router.get("/:id", controller.getProductById);

module.exports = router;
