const mongoose = require("mongoose");
const { Schema } = mongoose;
const catalogSchema = require("./catalog");

const cartSchema = new Schema({
    products: [catalogSchema],
    _user: { type: Schema.Types.ObjectId, ref: "Users" },
    quantities: [
        {
            productId: Number,
            qty: { type: Number, default: 1 }
        }
    ]
});

mongoose.model("Cart", cartSchema);
