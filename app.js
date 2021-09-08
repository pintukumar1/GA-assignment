const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const productRoutes = require('./routes/Product')
const userRoutes = require('./routes/User');
const cartRoutes = require('./routes/Cart');
require("dotenv").config()

const db = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.btsfj.mongodb.net/getart-db?retryWrites=true&w=majority`

mongoose
  .connect(db , {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });

  const port = process.env.PORT || 5000;

  const app = express();

/* Use JSON */
app.use(express.json());

/* Enable CORS while testing */
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* Routes */
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);

if(process.env.NODE_ENV == "production"){
  app.use(express.static("/client/build"))
}

app.listen(port, () => {
  console.log(`app listening at ${port}`);
});
