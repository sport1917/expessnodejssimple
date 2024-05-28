var express = require('express');
var router = express.Router();
var productModel = require('../model/product');
const { default: mongoose } = require('mongoose');

// POST ข้อมูล product
router.post('/', async function(req, res, next) {
    try{
        let body = req.body;
        let new_product = new productModel({
            product_id: body.product_id,
            product_name: body.product_name,
            price: body.price,
            amount: body.amount,
            detail: body.detail
        })

        let product = await new_product.save()
        
        return res.status(201).send({
            data: product,
            message: "create success"
        })
    }catch (error)
    {
        return res.status(error.status || 500).send({
            message: error.message
          })
    }
  });

  // GET ข้อมูล product ทั้งหมด
  router.get('/', async function(req, res, next) {
    try{
       
        let products = await productModel.find()

        // let productPrices = products.map(product => product.price);


        return res.status(201).send({
            // data: productPrices,
            data:products,
            message: "get success"
        })
       
    }catch (error)
    {
        return res.status(error.status || 500).send({
            message: error.message
          })
    }
  });

// GET ข้อมูล product ตาม id ที่เราเลือก
  router.get('/:id', async function(req, res, next) {
    try{
       let id = req.params.id
    //    if(!mongoose.Types.ObjectId.isValid(id)){
    //     return res.status(error.status || 400).send({
    //         message: "id invalid"
    //       })
    //    }
       let products = await productModel.findById(id)
        return res.status(201).send({
            data: products,
            message: "get success"
        })
       
    }catch (error)
    {
        return res.status(error.status || 500).send({
            message: error.message
          })
    }
  });

  //UPDATE ข้อมูบ product ตาม id 
  router.put('/:id', async function(req, res, next) {
    try{
       let id = req.params.id
       let body = req.body

       await productModel.updateOne(
        {_id : id },
        {
            $set: {
                product_name: body.product_name,
                price : body.price,
                amount : body.amount,
                detail : body.detail
            }
        }
       )

       let products = await productModel.findById(id)

        return res.status(201).send({
            data: products,
            message: "get success"
        })
       
    }catch (error)
    {
        return res.status(error.status || 500).send({
            message: error.message
          })
    }
  });

  //DELETE ข้อมูล product ตาม id
  router.delete('/:id', async function(req, res, next) {
    try{
       let id = req.params.id
    
       await productModel.deleteOne(
        {_id : id }
       )

       let products = await productModel.find();

        return res.status(201).send({
            data: products,
            message: "get success"
        })
       
    }catch (error)
    {
        return res.status(error.status || 500).send({
            message: error.message
          })
    }
  });


module.exports = router;