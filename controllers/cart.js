const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Cart = mongoose.model("Cart");
const Products = mongoose.model("Products");

//TODO !CRITICAL: Update cart to have only the quantities section, make checkout and quantity change atomic

module.exports = app => {
    /* ---------------------------- Add item to cart ---------------------------- */

    app.put("/:uname/cart", async (req, res) => {
        let uname = req.params.uname;
        const { productId } = req.body;
        let item = await Products.findOne({ productId: productId });
        if (!item) {
            res.send("Product with given ID does not exist, please try again"); //Checking for existing productId
        }
        let availableQuantity = item.availableQuantity;
        const temp = await Users.findOne({ username: uname });
        let currentCart = await Cart.findOne({ _user: temp._id }); //Update cart for the relevant user
        // console.log(currentCart);
        if (!currentCart.quantities[item.productId]) {
            let createdObj = { productId: item.productId }; //Check if item already exists in cart
            await Cart.findOneAndUpdate(
                { _user: temp._id },
                { $push: { products: item, quantities: createdObj } }
            );
        } else {
            if (
                availableQuantity - currentCart.quantities[item.productId].qty <
                0
            ) {
                res.send("We don't have enough in stock, sorry"); //if (availableQuantity < cartQuantity), throw error
            }
            await Cart.findOneAndUpdate(
                { _user: temp._id, "quantities.productId": item.productId },
                { $inc: { "quantities.$.qty": 1 } } //Increment cart quantity
            );
        }
        item["cartQuantity"] = currentCart.quantities[item.productId].qty;
        let final_item = {
            item: item,
            cartQuantity: item.cartQuantity
        };
        console.log(final_item);
        res.json(final_item);
    });

    /* -------------------------------- Get cart -------------------------------- */

    app.get("/:uname/cart", async (req, res) => {
        let uname = req.params.uname;
        const user = await Users.findOne({ username: uname });
        const userCart = await Cart.findOne({ _user: user._id });
        let final_item = {
            products: userCart.products,
            quantities: userCart.quantities
        };
        res.json(final_item);
    });

    /* ------------------------------ Checkout cart ----------------------------- */

    app.get("/:uname/checkout", async (req, res) => {
        let uname = req.params.uname;
        const user = await Users.findOne({ username: uname });
        const rawCart = await Cart.findOne({ _user: user._id });
        rawCart.products.map(async object => {
            let decrement = 0 - rawCart.quantities[object.productId].qty;
            await Products.findOneAndUpdate(
                { productId: object.productId },
                { $inc: { availableQuantity: decrement } } //decrement product stock by checkout quantity
            );
        });

        await Cart.findOneAndUpdate(
            { _user: user._id },
            { $set: { products: [], quantities: [] } } //update cart after checkout
        );
        res.send("works");
    });
};
