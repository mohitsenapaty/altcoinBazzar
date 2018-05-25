var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/exchange";
var db_client = new pg.Client(conString);
db_client.connect();
var express = require('express');
var app = express();
var loginRouter = express.Router();
var SHA224 = require('sha224');

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

async function login_authenticate(_usr, _pwd){
  var login_data = {'success':0,'data':{}};
  console.log(SHA224(_pwd, "utf8").toString('hex'));
  enc_pwd = SHA224(_pwd, "utf8").toString('hex');
  let db_client_quert = await db_client.query("SELECT * FROM user_login WHERE user_name=$1 AND password=$2;", [_usr, enc_pwd], function(err, res)
  {
    if (err){console.log(err); return login_data;}
    else
    { //console.log(res);
      console.log(res.rows.length);
      if (res.rows.length==1){
        console.log("successful login");
        login_data['data'] = res.rows[0];
      }
      return login_data;
      
    }
  });

}

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', loginRouter);

app.listen(8000, () => {
  console.log('Server started!');
});

module.exports=app;


