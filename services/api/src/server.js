require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`NMC Civic API running on port ${port}`);
    });
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();