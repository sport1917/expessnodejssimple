var express = require('express');
var router = express.Router();
var userModel = require('../model/user');
const { default: mongoose } = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// POST สมัคร user
router.post('/', async function(req, res, next) {
  try{
      let body = req.body;
      let hashpassword = await bcrypt.hash(body.password, 10);
      let new_user = new userModel({
          user_id : body.user_id,
          username: body.username,
          password: hashpassword,
          firstname: body.firstname,
          lastname: body.lastname,
          old: body.old,
          sex: body.sex
      })

      let user = await new_user.save()
      
      return res.status(201).send({
          data: user,
          message: "create user success"
      })
  }catch (error)
  {
      return res.status(error.status || 500).send({
          message: error.message
        })
  }
});

// POST login 
router.post('/login', async function(req, res, next) {
  try{
      let {username , password} = req.body;
      let user = await userModel.findOne({
        username: username,
      });
      if(!user){
        return res.status(500).send({
          message: "login fail"
        })
      }
      // ถอดรหัส bcrypt
      const checkPassword = await bcrypt.compare(password, user.password);
      if(!checkPassword){
        return res.status(500).send({
          message: "login fail"
        })
      }
      const  { _id, user_id, firstname, lastname , old, sex} = user;

      // gen token
      let token = jwt.sign({ _id, user_id, firstname, lastname , old, sex} , process.env.TOKEN_KEY)

      return res.status(201).send({
          data: { _id, user_id , firstname, lastname , old, sex , token},
          message: "login user success"
      })
  }catch (error)
  {
      return res.status(error.status || 500).send({
          message: error.message
        })
  }
});

// GET user ทั้งหมด
router.get('/', async function(req, res, next) {
  try{
     
      let users = await userModel.find()

      return res.status(201).send({
          data: users,
          message: "get success"
      })
     
  }catch (error)
  {
      return res.status(error.status || 500).send({
          message: error.message
        })
  }
});


//get user id
router.get('/:id', async function(req, res, next) {
  try{
     let id = req.params.id
     let users = await userModel.findById(id)
      return res.status(201).send({
          data: users,
          message: "get success"
      })
     
  }catch (error)
  {
      return res.status(error.status || 500).send({
          message: error.message
        })
  }
});


//UPDATE ข้อมูบ users ตาม id 
router.put('/:id', async function(req, res, next) {
  try{
     let id = req.params.id
     let body = req.body

     await userModel.updateOne(
      {_id : id },
      {
          $set: {
              firstname: body.firstname,
              lastname : body.lastname,
              old : body.old,
              sex : body.sex
          }
      }
     )
     let users = await userModel.findById(id)

      return res.status(201).send({
          data: users,
          message: "get success"
      })
     
  }catch (error)
  {
      return res.status(error.status || 500).send({
          message: error.message
        })
  }
});



  //DELETE ข้อมูล user ตาม id
  router.delete('/:id', async function(req, res, next) {
    try{
       let id = req.params.id
    
       await userModel.deleteOne(
        {_id : id }
       )

       let users = await userModel.find();

        return res.status(201).send({
            data: users,
            message: "get success"
        })
       
    }catch (error)
    {
        return res.status(error.status || 500).send({
            message: error.message
          })
    }
  });













// Test การ UpLoad ไฟล์ และ การใช้ jwt token



const multer = require('multer');
// const jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
  try{
    let token = req.headers.authorization.split('Bearer ')[1]
    let detoken = jwt.verify(token, process.env.TOKEN_KEY)
    req.detoken = detoken
    next()

  }catch (error){
    return res.status(401).send({
      message : error.message
    })

  }
}

router.get('/hello', checkToken, (req, res) => {
  // let token = req.headers.authorization.split('Bearer ')[1]
  // let detoken = jwt.verify(token, process.env.TOKEN_KEY)
  let detoken = req.detoken
  res.send({
    data: detoken,
    message : `hello ${detoken.role} ${detoken.name}`
  })
})

router.post('/login2', (req, res) => {
  let payload = {
    name: 'jj',
    role: 'admin'
  }

  let token = jwt.sign(payload , process.env.TOKEN_KEY)

  res.send({
    token : token
  })
})






const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage})

router.post('/upload', upload.array('img',2), (req,res) => {
  return res.send({
    message: 'upload success'
  })
}) 

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
