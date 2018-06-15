var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/exchange";
var db_client = new pg.Client(conString);
db_client.connect();

router.post('/', function(req, resp, next){
	console.log(req.body);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);

	var login_data = {'success':0,'data':{'wallet_present':'No', 'wallet_address':''}};

  db_client.query("SELECT * FROM ether_wallet_test_user WHERE user_id=$1;", [userID], function(err, res)
  {
    if (err){console.log(err); resp.send(login_data);}
    else
    { //console.log(res);
      console.log("AAA");
      console.log(res.rows.length);
      if (res.rows.length==1){
        console.log("Ether address is present");
        //login_data['data'] = res.rows[0];
        login_data['success'] = 1;
        login_data.data.wallet_present = 'Yes';
        login_data.data.wallet_address = res.rows[0].address;
        resp.send(login_data);
      }
      else{
        resp.send(login_data);
      }
   
    }
  });

	//resp.send(login_data);
});


module.exports = router;