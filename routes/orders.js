var express = require("express");
var router = express.Router();
var productModel = require("../model/product");
var orderModel = require("../model/order");
const { default: mongoose } = require("mongoose");

// Create Order
// router.post("/", async function (req, res, next) {
//     try {
//       let body = req.body;
//       let products = await productModel.find();
//       let total_price = 0;
//       // ใช้ for of ละจากนั้นใช้ find เพื่อเช็ตคว่า product_name กับ order.product_name มั้ย ถ้าตรงกันทุกอันก็เข้าเช็ค if ถ้าเช็คถูกหมดแล้ว return true
//       let allValid = true;
//       for (const order of body.order) {
//         try {
//           const product = products.find(
//             (product) => product.product_id == order.product_id && product.product_name == order.product_name
//           );
//           if (!product) {
//             throw {message: `หา'${order.product_name}' ไม่เจองะ`,status: 400,};
//           }
//           if (product.amount < order.amount) {
//             throw {message:"ที่สั่งอะมันมากกว่า ของที่เหลืองะ" + product.product_name,status: 400,};
//           }
//           if (product.amount === 0) {
//             throw { message: "สินค้าเหลือ " + product.product_name, status: 400 };
//           }
//           // เช็คว่าถูกแล้วก็ทำการ update productModel ให้ลด amount ตามจำนวน order
//           await productModel.updateOne(
//             { product_id: order.product_id },
//             { $inc: { amount: -order.amount } }
//           );
//         } catch (error) {
//           console.error("มัน error งะ", error);
//           allValid = false;
//           break; // หยุดการทำงาน loop ถ้าพบข้อผิดพลาด
//         }
//       }

//       //คำนวณราคาทั้งหมด
//       body.order.map(async (order) => {
//         total_price += order.price;
//       });

//       if (allValid) {
//           // ถ้า order ถูกต้องทั้งหมด ให้บันทึก order ลงใน MongoDB
//           let new_order = new orderModel({
//             order_id: body.order_id,
//             cus_name: body.cus_name,
//             order: body.order,
//             total_price: total_price,
//           });

//           let order = await new_order.save();

//           return res.status(201).send({
//             data: order,
//             message: "create order success",
//           });

//       } else {
//           return res.status(error.status || 500).send({
//               message: error.message,
//             });
//       }

//     } catch (error) {
//       return res.status(error.status || 500).send({
//         message: "แปลกๆ",
//       });
//     }
//   });

// GET ข้อมูล oerder ทั้งหมด
router.get("/", async function (req, res, next) {
  try {
    let orders = await orderModel.find();
    return res.status(201).send({
      data: orders,
      message: "get success",
    });
  } catch (error) {
    return res.status(error.status || 500).send({
      message: error.message,
    });
  }
});

// GET ข้อมูล order ตาม id ที่เราเลือก
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let orders = await orderModel.findById(id);
    return res.status(201).send({
      data: orders,
      message: "get success",
    });
  } catch (error) {
    return res.status(error.status || 500).send({
      message: error.message,
    });
  }
});

// Create Order
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let products = await productModel.find();
    let total_price = 0;
    let productsData = [];
    let allValid = true;

    // ใช้ for of ละจากนั้นใช้ find เพื่อเช็ตคว่า product_name กับ order.product_name มั้ย ถ้าตรงกันทุกอันก็เข้าเช็ค if ถ้าเช็คถูกหมดแล้ว return true
    for (const order of body.order) {
      try {
        const product = products.find(
          (product) => product.product_id == order.product_id
        );
        if (!product) {
          throw { message: `หา'${order.product_name}' ไม่เจองะ`, status: 400 };
        }
        if (product.amount < order.amount) {
          throw {
            message: "ที่สั่งอะมันมากกว่า ของที่เหลืองะ" + product.product_name,
            status: 400,
          };
        }
        
        productsData.push({
          product_id: order.product_id,
          product_name: product.product_name,
          amount: order.amount,
          price: product.price * order.amount,
        });

        //คำนวณราคาทั้งหมด
        total_price += product.price * order.amount;

      } catch (error) {
        console.error("มัน error งะ", error);
        allValid = false;
        // break; 
        return res.status(error.status || 500).send({
            message: "error นะ", error,
          });
      }
    }

    if (allValid && productsData.length > 0) {

    // เช็คว่าถูกแล้วก็ทำการ update productModel ให้ลด amount ตามจำนวน order
      for (const order of body.order) {
        await productModel.updateOne(
          { product_id: order.product_id },
          { $inc: { amount: -order.amount } }
        );
      }
      // ถ้า order ถูกต้องทั้งหมด ให้บันทึก order ลงใน MongoDB
      let new_order = new orderModel({
        order_id: body.order_id,
        cus_name: body.cus_name,
        order: productsData,
        total_price: total_price,
      });

      let order = await new_order.save();

      return res.status(201).send({
        data: order,
        message: "create order success",
      });
    } else {
      return res.status(error.status || 500).send({
        message: "เทสๆ",
      });
    }
  } catch (error) {
    return res.status(error.status || 500).send({
      message: "แปลกๆ",
    });
  }
});

// เวอร์ชั่น 3
// router.post('/', async function(req, res, next) {
//     try{

//         let body = req.body;

//         let new_order = new orderModel({
//             order_id: body.order_id,
//             cus_name: body.cus_name,
//             order: body.order,
//             total_price: body.total_price
//         })

//         let order = await new_order.save()

//         return res.status(201).send({
//             data: order,
//             message: "create order success"
//         })
//     }catch (error)
//     {
//         return res.status(error.status || 500).send({
//             message: error.message
//           })
//     }
//   });

// เวอร์ชั่น 2
// router.post('/', async function(req, res, next) {
//     try{
//         let body = req.body;
//         let products = await productModel.find()
//         let total_price = 0;
//         // .every เช็ตคว่า product_name กับ order.product_name มั้ย ถ้าตรงกันทุกอันก็เข้าเช็ค if ถ้าเช็คถูกหมดแล้ว return true ละเข้าฟังค์ชั่น if valid ในการ
//         //  save ข้อมูลเช้า mongoDB
//         const validProducts = body.order.every( async order => {
//             try {
//                 const product = products.find(product => product.product_name === order.product_name);
//                 if (product) {
//                     if (product.amount >= order.amount) {
//                         // เช็คว่าถูกแล้วก็ทำการ update productModel ให้ลด amount ตามจำนวน order
//                         await productModel.updateOne(
//                             { product_name: order.product_name },
//                             {
//                                 $inc: {
//                                     amount: -order.amount
//                                 }
//                             }
//                         )
//                         return true;
//                     }
//                     else if (product && product.amount < order.amount){
//                         throw { message: 'ที่สั่งอะมันน้อยกว่า ของที่เหลืองะ' + product.product_name, status: 400 };
//                     }
//                     else if (product && product.amount == 0) {
//                         throw { message: 'สินค้าเหลือ ' + product.product_name, status: 400 };
//                     } else {
//                         throw { message: `Insufficient stock for product '${product.product_name}' or invalid quantity requested.`, status: 400 };
//                     }
//                 } else {
//                     throw { message: `Product '${order.product_name}' not found.`, status: 400 };
//                 }
//             } catch (error) {
//                 console.error("มัน error งะ", error);
//                 return false;
//             }
//         });

//         //คำนวณราคาทั้งหมด
//         body.order.map( async (order) => {
//             total_price += order.price
//         })

//         if (validProducts) {
//             console.log(total_price)
//             // ถ้า order ถูกต้องทั้งหมด ให้บันทึก order ลงใน MongoDB
//             let new_order = new orderModel({
//                 order_id: body.order_id,
//                 cus_name: body.cus_name,
//                 order: body.order,
//                 total_price: total_price
//             });

//             let order = await new_order.save()

//             return res.status(201).send({
//                 data: order,
//                 message: "create order success"
//             })
//         };
//     }catch (error)
//     {
//         return res.status(error.status || 500).send({
//             message: error.message
//           })
//     }
//   });

module.exports = router;
