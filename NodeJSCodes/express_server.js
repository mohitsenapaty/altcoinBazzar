var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/exchange";
var db_client = new pg.Client(conString);
db_client.connect();
var express = require('express');
var app = express();
var loginRouter = express.Router();
var registerUserRouter = express.Router();
var getKYCStatusRouter = express.Router();
var updateKYCRouter = express.Router();
var uploadImageRouter = express.Router();
var SHA224 = require('sha224');
var multer = require('multer')

loginRouter.post('/', function(req, resp, next) { 
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var username = req.body.username;
  var password = req.body.password;
  
  var login_data = {'success':0,'data':{}};
  console.log(SHA224(password, "utf8").toString('hex'));
  enc_pwd = SHA224(password, "utf8").toString('hex');
  db_client.query("SELECT * FROM user_login WHERE user_name=$1 AND password=$2;", [username, enc_pwd], function(err, res)
  {
    if (err){console.log(err); resp.send(login_data);}
    else
    { //console.log(res);
      console.log(res.rows.length);
      if (res.rows.length==1){
        console.log("successful login");
        login_data['data'] = res.rows[0];
        login_data['success'] = 1;
      }
      resp.send(login_data);
   
    }
  });
});

registerUserRouter.post('/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var username = req.body.username;
  var password = req.body.password;
  var confPassword = req.body.confPassword;
  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;
  var phone = req.body.phone;

  var register_data = {'success':0,'data':{}};
  if (password != confPassword){
    resp.send(register_data);
  }
  //console.log(SHA224(password, "utf8").toString('hex'));
  enc_pwd = SHA224(password, "utf8").toString('hex');
  db_client.query("INSERT INTO user_login(user_name, name, phone, email, password) values ($1, $2, $3, $4, $5);", [username, name, phone, email, enc_pwd], function(err, res)
  {
    if (err){console.log(err); resp.send(register_data);}
    else
    { //console.log(res);
      db_client.query("insert into user_profile(user_id, name, surname, kyc_status, creation_time) values ($1, $2, $3, false, CURRENT_TIMESTAMP);", [res.rows[0].id, name, surname], function(err1, res1){
        if (err1){console.log(err1); resp.send(register_data);}
	else{
          console.log("Successfully registered");
          register_data['success'] = 1;
          resp.send(register_data);
        }
      });

      //console.log("Successfully registered");
      //register_data['success'] = 1;
      //resp.send(register_data);

    }
  });
});

getKYCStatusRouter.post('/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);

  var login_data = {'success':0,'data':{}};
  db_client.query("SELECT * FROM user_profile WHERE user_id=$1;", [userID], function(err, res)
  {
    if (err){console.log(err); resp.send(login_data);}
    else
    { //console.log(res);
      console.log(res.rows.length);
      if (res.rows.length==1){
        console.log("successful login");
        login_data['data'] = res.rows[0];
        login_data['success'] = 1;
      }
      resp.send(login_data);

    }
  });
});


const upload = multer({
    dest:'/home/sanket/altcoinBazzar/NodeJSCodes/', 
    limits: {fileSize: 5242880, files: 1},
    fileFilter:  (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')


uploadImageRouter.post('/',function (req, resp, next) {
    var result = {'success':0}
    upload(req, resp, function (err) {
        if (err) {
            console.log("Error while uploading Image")
            resp.send(result)
        } else {
            console.log("Image uploaded successfully")
            result['success'] = 1
            resp.send(result)
        }
    })
});


updateKYCRouter.post('/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var user_id = req.body.user_id;
  var aadhar_no = req.body.aadharNumber;
  var pan_no = req.body.panNumber;
  var aadhar_name = req.body.aadhar_name;
  var aadhar_dob = req.body.aadharDOB;
  var address = req.body.address;
  var city = req.body.cityName;
  var state = req.body.stateName;
  var pincode = req.body.pincode;
  var residentialStatus = req.body.residentialStatus;
  var panImageName = req.body.panImageName;
  var aadharImageName = req.body.aadharImageFrontName;
  var photoName = req.body.passportImage;

  db_client.query("INSERT INTO user_login(user_name, name, phone, email, password) values ($1, $2, $3, $4, $5);", [username, name, phone, email, enc_pwd], function(err, res)
  {
    if (err){console.log(err); resp.send(register_data);}
    else
    { //console.log(res);
      db_client.query("insert into user_profile(user_id, name, surname, kyc_status, creation_time) values ($1, $2, $3, false, CURRENT_TIMESTAMP);", [res.rows[0].id, name, surname], function(err1, res1){
        if (err1){console.log(err1); resp.send(register_data);}
    else{
          console.log("Successfully registered");
          register_data['success'] = 1;
          resp.send(register_data);
        }
      });

      //console.log("Successfully registered");
      //register_data['success'] = 1;
      //resp.send(register_data);

    }
  });
});


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/registerUser', registerUserRouter);
app.use('/getKYCStatus', getKYCStatusRouter);
app.use('/updateKYC', updateKYCRouter);
app.use('/uploadImage', uploadImageRouter);

app.listen(8000, () => {
  console.log('Server started!');
});

module.exports=app;


