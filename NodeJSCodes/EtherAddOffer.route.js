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
  var paymethod = req.body.paymethod;

	var login_data = {'success':0,'data':''};

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
  if (!(paymethod == 'Any' || paymethod == 'IMPS' || paymethod == 'UPI' || paymethod == 'PAYTM')){
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

      db_client.query("INSERT INTO OfferTable(user_id,ticker,offerType,quant,price,totalPrice,fillPercent,status,lastModified,createDate,paymethod) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$9);"
        , [userID,ticker,offerType,quant,price,totalPrice,0.0,'Valid',paymethod]
        , function(err, res)
      {
        if (err){console.log(err); resp.send(login_data);}
        else
        { //console.log(res);
          login_data['success'] = 1;
          console.log("AAA");
          console.log(res.rows.length);
          resp.send(login_data);
       
        }
        db_client.end(function(err){

          if (err){console.log(err);}
        });
      });

    });
  }
  else{

    //check if balance is valid.
    var db_client = new pg.Client(conString);
    db_client.connect(function(err){

      if (err){console.log(err); resp.send(login_data);}

      db_client.query("SELECT * FROM quant_wallet_test_user WHERE user_id=$1 AND token_symbol=$2;", [userID, ticker], function(err, res)
      {
        if (err){
          console.log(err); resp.send(login_data);
          db_client.end(function(err1){

            if (err1){console.log(err1);}
          });
        }
        else
        { //console.log(res);
          console.log("AAA");
          console.log(res.rows.length);
          if (res.rows.length==1){
            //console.log("Ether address is present");
            //login_data['data'] = res.rows[0];
            //login_data['success'] = 1;
            //login_data.data.wallet_present = 'Yes';
            //login_data.data.wallet_address = res.rows[0].address;
            //resp.send(login_data);
            wallet_data = res.rows[0];
            if (wallet_data.quant - wallet_data.withdrawal_block - wallet_data.offer_block > quant){
              //add order
              //insert to db
              db_client.query("INSERT INTO OfferTable(user_id,ticker,offerType,quant,price,totalPrice,fillPercent,status,lastModified,createDate,paymethod) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$9);"
                , [userID,ticker,offerType,quant,price,totalPrice,0.0,'Valid',paymethod]
                , function(err1, res1)
              {
                if (err1){
                  console.log(err1); resp.send(login_data);
                  db_client.end(function(err2){

                    if (err){console.log(err2);}
                  });
                }
                else
                { //console.log(res);
                  //login_data['success'] = 1;
                  //console.log("AAA");
                  //console.log(res.rows.length);
                  //resp.send(login_data);
                  new_offer_quant = wallet_data.offer_block + quant; 
                  db_client.query("update quant_wallet_test_user set offer_block=$1 where user_id=$2 and token_symbol=$3;"
                    ,[new_offer_quant, userID, ticker]
                    ,function(err2,res2){
                    if (err2){console.log(err2); resp.send(login_data);}
                    else
                    { //console.log(res);
                      login_data['success'] = 1;
                      //console.log("AAA");
                      //console.log(res.rows.length);
                      resp.send(login_data);
                   
                    }
                    db_client.end(function(err3){

                      if (err3){console.log(err3);}
                    });
                  });
               
                }
                
              });
                //then change offer block
            }
            else{
              //return because insufficient funds
              resp.send(login_data);
              db_client.end(function(err1){

                if (err1){console.log(err1);}
              });
            }
          }
          else{
            resp.send(login_data);
            db_client.end(function(err1){

              if (err1){console.log(err1);}
            });
          }
       
        }
        
      });

    });

  }

  /*
  
  */
  

	//resp.send(login_data);
});


module.exports = router;