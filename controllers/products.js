const mongoose = require("mongoose");
const Products = mongoose.model("Products");

let idCounter = 0;

module.exports = app => {
    app.get("/products", async (req, res) => {
        let products = await Products.find();
        res.json(products);
    });

    app.post("/products", async (req, res) => {
        const {
            category,
            productName,
            productModel,
            price,
            availableQuantity
        } = req.body;
        const product = new Products({
            productId: idCounter,
            category,
            productName,
            productModel,
            price,
            availableQuantity
        });
        try {
            await product.save();
            idCounter += 1;
            res.send("Successfully added to cart");
        } catch (err) {
            console.log(err);
            res.send(500).send(err);
        }
    });
};
