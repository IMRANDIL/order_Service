const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Create a new order
router.post("/orders", orderController.createOrder);

module.exports = router;
