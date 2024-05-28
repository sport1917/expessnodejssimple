const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    let token = req.headers.authorization.split('Bearer ')[1]
    let detoken = jwt.verify(token, process.env.TOKEN_KEY)
    req.detoken = detoken
    next()

  }catch (error){
    return res.status(401).send({
      message : 'Auth fail'
    })

  }
}