const mongoose = require("mongoose");
const orders = new mongoose.Schema({
    order_id: {type: Number , unique: true},
    cus_name: {type: String},
    order: {type: Array},
    total_price: {type: Number},
});

orders.pre('save', async function(next) {
    if (this.isNew) {
        // ตรวจสอบว่ามี order อื่นๆ ในฐานข้อมูลหรือยัง
        if ((await this.constructor.countDocuments()) === 0) {
            // ถ้ายังไม่มี order ในฐานข้อมูลให้ order_id เริ่มจากเลข 1
            this.order_id = 1;
        } else {
            // ถ้ามี order อื่นๆ ในฐานข้อมูลให้ order_id เริ่มจากเลขสูงสุด + 1
            const highestOrder = await this.constructor.findOne({}, {}, { sort: { 'order_id': -1 } });
            this.order_id = highestOrder.order_id + 1;
        }
    }
    next();
});

module.exports = mongoose.model("orders", orders);