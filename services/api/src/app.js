const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRouter = require("./routes");
const {
  notFound,
  errorHandler
} = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(",")
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;