const api_token_key = 'Y9P4RTAR77FKYQPW2CAGXZYED1P4T99Y4I';

var Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
var web3_etherscan = new Web3(new Web3.providers.HttpProvider('https://ropsten.etherscan.io'));
var ethUtil = require('ethereumjs-util');
var ethTx = require('ethereumjs-tx');

var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/exchange";

var express = require('express');
var router = express.Router();

var crypto = require('crypto');

router.post('/:pwd/', function(req, resp, next){
	console.log(req.body);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);

	var login_data = {'success':0,'data':{'wallet_present':'No', 'wallet_address':''}};

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

  var privateKey = crypto.randomBytes(32);
  var private_key_string = privateKey.toString('hex');
  console.log(private_key_string);

  var address = ethUtil.privateToAddress(privateKey);
  var address_string = address.toString('hex');

  var public_key = ethUtil.privateToPublic(privateKey);
  var public_key_string = public_key.toString('hex');

  console.log(public_key_string);
  console.log(address_string);

  var db_client = new pg.Client(conString);
  db_client.connect(function(err){

    if (err){console.log(err); resp.send(login_data);}

    db_client.query("INSERT INTO ether_wallet_test_user(user_id, priv_key, pub_key, address) VALUES ($1,$2,$3,$4);", 
      [userID, private_key_string, public_key_string, address_string], function(err, res)
    {
      if (err){
        console.log(err); 
        resp.send(login_data);
        db_client.end(function(err1){

          if (err){console.log(err1);}
        });
      }
      else
      { //console.log(res);
        db_client.query("SELECT * FROM ether_wallet_test_user WHERE address=$1;", [address_string], function(err1, res1)
        {
            if (err1){
              console.log(err1);
              resp.send(login_data);
              db_client.end(function(err2){

                if (err){console.log(err2);}
              });
            }
            else
            { //console.log(res);
                
              console.log("AAA");
              console.log(res1.rows.length);
              if (res1.rows.length==1){
                console.log("Ether address is present");
                //login_data['data'] = res.rows[0];
                //login_data['success'] = 0;
                login_data.data.wallet_present = 'Yes';
                login_data.data.wallet_address = res1.rows[0].address;
                db_client.query("INSERT INTO quant_wallet_test_user(user_id, token_symbol, token_name, quant, wallet_id, withdrawal_block, offer_block) VALUES($1, $2, $3, $4, $5, $6, $7);", 
                  [userID, 'ETH', 'Ether', 0.0, res1.rows.id, 0.0, 0.0], 
                  function(err2, res2)
                {
                  if (err1){
                    console.log(err1);
                    resp.send(login_data);
                    
                  }
                  else{
                    login_data['success'] = 1;
                    login_data.data.wallet_present = 'Yes';
                    login_data.data.wallet_address = res1.rows[0].address;
                    resp.send(login_data);
                  }
                  db_client.end(function(err2){

                    if (err){console.log(err2); }
                  });
                });
                //resp.send(login_data);
              }
              else{
                resp.send(login_data);
              }
                //console.log(res.rows[iter_res]);
                //var addrData = res.rows[iter_res];
                //var addr = addrData["address"];
                //update_addr_list(addr, addrData);
              /*  
              db_client.end(function(err){

                if (err){console.log(err);}
              });
              */
            }
        });
     
      }
      //db_client.end(function(err){

      //  if (err){console.log(err);}
      //});
    });

  });
  

	//resp.send(login_data);
});


module.exports = router;