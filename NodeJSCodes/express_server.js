var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/exchange";
var db_client = new pg.Client(conString);
db_client.connect();
var express = require('express');
var app = express();
var loginRouter = express.Router();
var registerUserRouter = express.Router();
var getKYCStatusRouter = express.Router();
var getAllPayMethodsRouter = express.Router();
var updateKYCRouter = express.Router();
var updateIMPSRouter = express.Router();
var updateUPIRouter = express.Router();
var updatePAYTMRouter = express.Router();
var uploadImageRouter = express.Router();
var BitcoinWalletRetrieveRouter = require('./BitcoinWalletRetrieve.route');
var EtherWalletRetrieveRouter = require('./EtherWalletRetrieve.route');
var EtherAddressGenerateRouter = require('./EtherAddressGenerate.route');
var EtherAddOfferRouter = require('./EtherAddOffer.route');
var SHA224 = require('sha224');
var multer = require('multer')
require('isomorphic-fetch')
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: '8-wDj0PmK0AAAAAAAAAdgoG6JAANa8vubD3xoGWXM0RHQaVzhwV40XAvdYGsvO94'});
var crypto = require('crypto');

const file_upload_dest_dev = '/Users/msenapaty/Documents/react_native_ios/altcoinBazzar/NodeJSCodes/';
const file_upload_dest = '/var/www/altcoinBazzar/'

loginRouter.post('/', function(req, resp, next) { 
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var username = req.body.username;
  var password = req.body.password;
  
  var login_data = {'success':0,'data':{},'token':''};
  console.log(SHA224(password, "utf8").toString('hex'));
  enc_pwd = SHA224(password, "utf8").toString('hex');
  db_client.query("SELECT * FROM user_login WHERE user_name=$1 AND password=$2;", [username, enc_pwd], function(err, res)
  {
    if (err){console.log(err); resp.send(login_data);}
    else
    { //console.log(res);
      console.log(res.rows.length);
      if (res.rows.length==1){
        var api_key = crypto.createCipher('aes-128-cbc', 'mypassword');
        var got_id = api_key.update((res.rows[0].user_id).toString(), 'utf8', 'hex');
        got_id += api_key.final('hex');
        console.log("successful login " + got_id);
        login_data['data'] = res.rows[0];
        login_data['success'] = 1;
        login_data['token'] = got_id;
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
  db_client.query("INSERT INTO user_login(user_name, name, phone, email, password) values ($1, $2, $3, $4, $5) RETURNING id;", [username, name, phone, email, enc_pwd], function(err, res)
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

updateIMPSRouter.post('/:pwd/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var user_id = req.body.user_id;
  var userID = parseInt(user_id, 10);
  var bank_name = req.body.bank_name;
  var ifsc = req.body.ifsc;
  var account_no = req.body.account_no;
  var account_type = req.body.account_type;
  var account_holder_name = req.body.account_holder_name;

  var register_data = {'success':0,'data':{}};

  try{
    var api_key = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var got_id = api_key.update(req.params.pwd, 'hex', 'utf8');
    got_id += api_key.final('utf8');
    console.log(got_id + " qqq" );
  }
  catch(error){
    console.log(error);
    resp.send(login_data);
    return;
  }
  if (got_id != userid){
    resp.send(login_data);
    return;
  }
  //console.log(SHA224(password, "utf8").toString('hex'));
  //enc_pwd = SHA224(password, "utf8").toString('hex');
  db_client.query("INSERT INTO imps_payment_method(bank_name, ifsc, account_no, account_holder_name, account_type, status) values ($1, $2, $3, $4, $5, $6)  RETURNING payment_id;", [bank_name, ifsc, account_no, account_holder_name, account_type, 'A'], function(err, res)
  {
    if (err){console.log(err); resp.send(register_data);}
    else
    { console.log(res.rows[0]);
      db_client.query("insert into general_payment_method(user_id, payment_type, payment_id) values ($1, $2, $3);", [userID, 'IMPS', res.rows[0].payment_id], function(err1, res1){
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

updateUPIRouter.post('/:pwd/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var user_id = req.body.user_id;
  var userID = parseInt(user_id, 10);
  var upi_address = req.body.upi_address;

  var register_data = {'success':0,'data':{}};

  try{
    var api_key = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var got_id = api_key.update(req.params.pwd, 'hex', 'utf8');
    got_id += api_key.final('utf8');
    console.log(got_id + " qqq" );
  }
  catch(error){
    console.log(error);
    resp.send(register_data);
    return;
  }
  if (got_id != userid){
    resp.send(register_data);
    return;
  }

  //console.log(SHA224(password, "utf8").toString('hex'));
  db_client.query("INSERT INTO upi_payment_method(upi_address, status) values ($1, $2)  RETURNING payment_id;", [upi_address, 'A'], function(err, res)
  {
    if (err){console.log(err); resp.send(register_data);}
    else
    { //console.log(res);
      db_client.query("insert into general_payment_method(user_id, payment_type, payment_id) values ($1, $2, $3) ;", [userID, 'UPI', res.rows[0].payment_id], function(err1, res1){
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

updatePAYTMRouter.post('/:pwd/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var user_id = req.body.user_id;
  var userID = parseInt(user_id, 10);
  var paytm_number = req.body.paytm_number;

  var register_data = {'success':0,'data':{}};

  try{
    var api_key = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var got_id = api_key.update(req.params.pwd, 'hex', 'utf8');
    got_id += api_key.final('utf8');
    console.log(got_id + " qqq" );
  }
  catch(error){
    console.log(error);
    resp.send(register_data);
    return;
  }
  if (got_id != userid){
    resp.send(register_data);
    return;
  }

  //console.log(SHA224(password, "utf8").toString('hex'));
  db_client.query("INSERT INTO paytm_payment_method(paytm_number, status) values ($1, $2)  RETURNING payment_id;", [paytm_number, 'A'], function(err, res)
  {
    if (err){console.log(err); resp.send(register_data);}
    else
    { //console.log(res);
      db_client.query("insert into general_payment_method(user_id, payment_type, payment_id) values ($1, $2, $3);", [userID, 'PAYTM', res.rows[0].payment_id], function(err1, res1){
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

getAllPayMethodsRouter.post('/:pwd/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);

  var login_data = {'success':0,'data':{'imps':{}, 'upi':{}, 'paytm':{}}};

  try{
    var api_key = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var got_id = api_key.update(req.params.pwd, 'hex', 'utf8');
    got_id += api_key.final('utf8');
    console.log(got_id + " qqq" );
  }
  catch(error){
    console.log(error);
    resp.send(login_data);
    return;
  }
  if (got_id != userid){
    resp.send(login_data);
    return;
  }

  db_client.query("SELECT * FROM general_payment_method WHERE user_id=$1;", [userID], function(err, res)
  {
    if (err){console.log(err); resp.send(login_data);}
    else
    { //console.log(res);
      console.log(res.rows.length);
      console.log("....");
      if (res.rows.length>=1){
        payment_id_arr_imps = [];
        payment_id_arr_upi = [];
        payment_id_arr_paytm = [];
        for (var i = 0; i < res.rows.length; i++){
          if (res.rows[i].payment_type == 'IMPS') payment_id_arr_imps.push(parseInt(res.rows[i].payment_id, 10));
          if (res.rows[i].payment_type == 'UPI') payment_id_arr_upi.push(parseInt(res.rows[i].payment_id, 10));
          if (res.rows[i].payment_type == 'PAYTM') payment_id_arr_paytm.push(parseInt(res.rows[i].payment_id, 10));
        }
        //console.log("successful login");
        //banks added now find out all the payment methods
        db_client.query("SELECT * FROM imps_payment_method WHERE payment_id=ANY($1) AND status='A';",[payment_id_arr_imps],function(err_imps, res_imps){
          if (err_imps){console.log(err_imps);resp.send(login_data);}
          console.log(res_imps.rows[0]);
          if (res_imps.rows.length >= 1){
            login_data.data.imps = res_imps.rows[0];
            console.log(login_data);
          }
          db_client.query("SELECT * FROM upi_payment_method WHERE payment_id=ANY($1) AND status='A';",[payment_id_arr_upi],function(err_upi, res_upi){
            if (err_upi){console.log(err_upi);resp.send(login_data);}
            else{
              console.log("Here upi");
              console.log(login_data);
              if (res_upi.rows.length >= 1) login_data.data.upi = res_upi.rows[0];
            }
            db_client.query("SELECT * FROM paytm_payment_method WHERE payment_id=ANY($1) AND status='A';",[payment_id_arr_paytm],function(err_paytm, res_paytm){
              if (err_paytm){console.log(err_paytm);resp.send(login_data);}
              else{
                console.log("Here paytm");
                if (res_paytm.rows.length >= 1) login_data.data.paytm = res_paytm.rows[0];
                login_data['success'] = 1;
                console.log(login_data);
                resp.send(login_data);
              }
            });
          });
        });
        //login_data['data'] = res.rows[0];
        //login_data['success'] = 1;
      }
      else{
        console.log("Banks Not Added");
        login_data['success'] = 1;
        resp.send(login_data);
      }
      //resp.send(login_data);

    }
  });
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, file_upload_dest)
    },
    filename: function (req, file, cb) {
        cb(null, req.body.file_name)
  }
})



var upload = multer({ storage: storage }).single('image')

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
            /*dbx.filesUpload({contents:req.file.buffer, path:'/' + req.body.file_name}).then(function (err, data) {
                if (err) 
                {
                    return console.error(err)
                }
            }).catch(function(error) {
                        console.error(error)
            });*/
        }
    })
});


updateKYCRouter.post('/', function(req, resp, next) {
  //console.log(req);
  console.log(req.body);
  //console.log(next);
  var kyc_data = {'success':0};
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
  var panImagelink = req.body.panImageName;
  var aadharImagelink = req.body.aadharImageFrontName;
  var photolink = req.body.passportImage;

  db_client.query("INSERT INTO kyc(user_id, aadhar_name, aadhar, pan, dob, address, city, state, pincode, residential_status, aadhar_image, pan_image, photograph) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);", [user_id , name, aadhar_name, aadhar_no, pan_no, aadhar_dob, address, city, state, pincode, residentialStatus, aadharImagelink, panImagelink, photolink], function(err, res)
  {
    if (err)
    {
      console.log(err); 
      resp.send(register_data);
    }
    else
    { 
      db_client.query("UPDATE user_profile SET kyc_status = $1 WHERE user_id = $2;"),[true,user_id], function(err, res)
      {

        if (err)
        {
          console.log(err);
          resp.send(register_data);
        }
        else
        {
          console.log("Successfully registered");
          kyc_data['success'] = 1;
          resp.send(register_data);
        }
      }
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
app.use('/updateUPI', updateUPIRouter);
app.use('/updateIMPS', updateIMPSRouter);
app.use('/updatePAYTM', updatePAYTMRouter);
app.use('/uploadImage', uploadImageRouter);
app.use('/getAllPayMethods', getAllPayMethodsRouter);
app.use('/BitcoinWalletRetrieve', BitcoinWalletRetrieveRouter);
app.use('/EtherWalletRetrieve', EtherWalletRetrieveRouter);
app.use('/EtherAddressGenerate', EtherAddressGenerateRouter);
app.use('/EtherAddOffer', EtherAddOfferRouter)

app.listen(8000, () => {
  console.log('Server started!');
});

module.exports=app;


