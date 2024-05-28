var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send('GET api');

  let header = req.headers
  res.send(header)
});

router.get('/index/:name/:age', function(req, res, next) {
  // res.send('GET api');

  try{
    let params = req.params

    if(params.name === "hello")
      throw { message: "name not hello", status: 400}

    return res.send({
      data : params,
      message: "Success"
    })
  }catch (error){
    return res.status(error.status || 500).send({
      message: error.message
    })
  }
  
});




router.post('/checkGrade', function(req, res, next) {
  try{
    let body = req.body
    let subjectdata = []
    let totalscore = 0;

    body.map(item => {
      if (item.subject && item.score) {
        if(item.score > 100 || item.score < 0){
          throw { message:"ใส่เลขไม่ถูกต้อง", status: 400}
        }
        else if ( item.score >= 80) {
          subjectdata.push({ "subject": item.subject, "grade": item.score = "A"});
          totalscore += 4;
        }
        else if (item.score >= 70) {
          subjectdata.push({ "subject": item.subject, "grade": item.score = "B"});
          totalscore += 3;
        }
        else if (item.score >= 60){
          subjectdata.push({ "subject": item.subject, "grade": item.score = "C"});
          totalscore += 2;
        }
        else if (item.score >= 50){
          subjectdata.push({ "subject": item.subject, "grade": item.score = "D"});
          totalscore += 1;
        }
        else {
          subjectdata.push({ "subject": item.subject, "grade": item.score = "F"});
          totalscore += 0;
        }
      }
      else {
        throw { message: "no subject or no score", status: 400}
      }
    }
    );

    let GPA = (totalscore / body.length).toFixed(2);

    return res.send({
      data : {"subject" : subjectdata, "GPA" : GPA}, 
      message: "Success"
    })
  }catch (error){
    return res.status(error.status || 500).send({
      message: error.message
    })
  }
  
});


router.post('/', function(req, res, next) {
  // res.send('POST api');

  let body = req.body
  res.send(body)
});

router.put('/', function(req, res, next) {

  let query = req.query
  res.send(query);
});

router.delete('/', function(req, res, next) {
  res.send('DELETE api');
});
module.exports = router;
