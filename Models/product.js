const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },                    // ✅ Added category field
    image: { type: String },
    rating: {                                       // ✅ Added rating field
        rate: { type: Number },
        count: { type: Number }
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
