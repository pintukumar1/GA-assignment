const router = require("express").Router();
const Product = require('../models/Product');
/* Return list of n product wiht name and price */
router.get("/:num", async (req, res) => {
  try {
    let numberOfItems = parseInt(req.params.num, 10);
    if (!isNaN(numberOfItems) && numberOfItems <= 100) {
      /* Maximum limit is 100 */
      let product = await Product.find()
        .limit(numberOfItems)
        .select({ title: 1, price: 1, coverImage: 1 });
      res.json(product);
    } else {
      throw new Error("Invalid limit specifed!");
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

/* To get details of a product */
router.get("/details/:productId", async (req, res) => {
  try {
    Product.findById(req.params.productId, (err, data) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.json(data);
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

/* To add a product */
router.post("/add", async (req, res) => {
  /* Initialize the schema using the data from POST request */
  const newProduct = new Product(req.body);

  /* Save the values to the DB */
  try {
    await newProduct.save();
    res.json("Product Added!");
  } catch (err) {
    res.status(400).json(err);
  }
});

/* To search for products */
router.get("/search/:query", async (req, res) => {
  try {
    Product.find(
      { title: { $regex: req.params.query, $options: "ims" } },
      "title price coverImage",
      (err, data) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.json(data);
          console.log(data);
        }
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
