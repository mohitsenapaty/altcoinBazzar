var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/exchange";

var crypto = require('crypto');

router.post('/:pwd/', function(req, resp, next){
	console.log(req.body);

  var userid = req.body.user_id;
  var userID = parseInt(userid, 10);
  var ticker = req.body.ticker;
  var offerType = req.body.offerType;
  var quant = parseFloat(req.body.quant);
  var price = parseFloat(req.body.price);
  var totalPrice = parseFloat(req.body.totalPrice);

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
  if (ticker != 'ETH'){
    resp.send(login_data);
    return;
  }
  if (quant * price != totalPrice){
    resp.send(login_data);
    return;   
  }
  if (!(offerType == 'Buy' || offerType == 'Sell')){
    resp.send(login_data);
    return;
  }

  //if (re)
  //OfferTable:- offer_id, user_id, ticker, offerType, quant, price, totalPrice, filled, status, lastModified, createDate
  //index of offer_id, user_id, ticker
  //TransactionTable:- (for every completed offer) transaction_id, offer_id, offerType, ticker, value_inr, seller_user_id, buyer_user_id, createDate
  //index of transaction_id, offer_id, ticker, seller_user_id, buyer_user_id
  
  //check wallet first -> add offer in case of buy offer, just create the offer

  if (offerType == 'Buy'){
    var db_client = new pg.Client(conString);
    db_client.connect(function(err){

      if (err){console.log(err); resp.send(login_data);}

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
        db_client.end(function(err){

          if (err){console.log(err);}
        });
      });

    });
  }
  else{

  }

  /*
  
  */
  

	//resp.send(login_data);
});


module.exports = router;