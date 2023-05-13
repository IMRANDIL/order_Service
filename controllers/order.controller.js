const Order = require("../models/order.model");
const RedisMQ = require("rsmq");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, productName, quantity } = req.body;

    // Create the order in the database
    const order = new Order({ customerName, productName, quantity });
    await order.save();

    // Send a message to the Order Processor
    const rsmq = new RedisMQ({
      host: process.env.REDIS_HOST, // Redis host address (Docker container IP)
      port: process.env.REDIS_PORT, // Redis port (default: 6379)
      ns: process.env.REDIS_NAMESPACE, // Optional: Redis namespace
    });

    // Send the order as a message
    rsmq.sendMessage(
      { qname: "orderQueue", message: JSON.stringify(order) },
      function (err, resp) {
        if (err) {
          console.error(err);
          return;
        }

        console.log("Message sent. ID:", resp);
      }
    );
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};
