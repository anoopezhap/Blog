const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { dot } = require("node:test/reporters");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

dotenv.config();

const app = express();

const uri = process.env.MONGODB_URI;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

//DB and Server initiated
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("connected");
  }
}
run().catch(console.dir);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
