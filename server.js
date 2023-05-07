require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const logger = require("./utils/logger");
const compression = require("compression");
const app = express();

const PORT = process.env.PORT || 9012;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

//routes..
app.use("/api/v1", require("./routers/order.router"));

//setup the db connection

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`server runs on port: ${PORT}`);
    });

    server.on("error", (err) => {
      logger.error(`error running server: ${err.message}`);
      process.exit(1);
    });
  })
  .catch((err) => {
    logger.error(`error Connection mongoDB: ${err.message}`);
    process.exit(1);
  });
