const mongoose = require("mongoose");
const { Schema } = mongoose;

const catalogSchema = new Schema({
    productId: { type: Number, default: 0 },
    category: String,
    productName: String,
    productModel: String,
    price: Number,
    availableQuantity: Number
});

mongoose.model("Products", catalogSchema);

module.exports = catalogSchema;
