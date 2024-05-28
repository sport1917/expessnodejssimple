const mongoose = require("mongoose");
const products = new mongoose.Schema({
    product_id: {type: Number,unique: true},
    product_name: {type: String},
    price: {type: Number},
    amount: {type: Number},
    detail: {type: Object}
});

products.pre('save', async function(next) {
    if (this.isNew) {
        if ((await this.constructor.countDocuments()) === 0) {
            this.product_id = 1;
        } else {
            const highestProduct = await this.constructor.findOne({}, {}, { sort: { 'product_id': -1 } });
            this.product_id = highestProduct.product_id + 1;
        }
    }
    next();
});


module.exports = mongoose.model("products", products);