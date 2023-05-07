const Order = require("../models/order.model");
const RSMQWorker = require("rsmq-worker");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, productName, quantity } = req.body;

    // Create the order in the database
    const order = new Order({ customerName, productName, quantity });
    await order.save();

    // Send a message to the Order Processor
    const worker = new RSMQWorker("orderQueue");
    worker.send(JSON.stringify(order), (err, messageId) => {
      if (err) {
        console.error("Failed to send message to Order Processor:", err);
      } else {
        console.log("Message sent to Order Processor with ID:", messageId);
      }
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};
