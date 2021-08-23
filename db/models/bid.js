const { pool, shouldAbort } = require("../conn");
const bcrypt = require("bcrypt");
const datetime = require('node-datetime');
const Wallet = require("./wallet");

class Bid{
    get_max_bid(product_id, callback){
        var searchQuery = "SELECT COALESCE(max(rate) , 0) as maximum,COALESCE(sum(max_quantity) , 0) as quantity from public.bid where product_id=$1;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }

          client
            .query(searchQuery,[product_id])
            .then((res) => {
              if (res.rowCount == 0) {
                callback(null, null);
              } else {
                callback(null, res.rows);
              }
            })
            .catch((e) => {
              console.log(e);
              callback("error");
            });
          done();
        });
    }

    bid_history(user_id, callback){
      var searchQuery = "SELECT * from public.bid where user_id=$1;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }

          client
            .query(searchQuery,[user_id])
            .then((res) => {
              if (res.rowCount == 0) {
                callback(null, null);
              } else {
                callback(null, res.rows);
              }
            })
            .catch((e) => {
              console.log(e);
              callback("error");
            });
          done();
        });
    }

    create_bid(bid, callback){
        var searchQuery = "INSERT INTO public.bid (user_id, product_id, min_quantity, max_quantity, rate, amount, bid_date, bid_time) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 ) returning id;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
          client
            .query("BEGIN")
            .then((res) => {
              if (shouldAbort(err, done)) {
                callback(err, null);
              }
              client
                .query(searchQuery,[
                    bid.user_id, 
                    bid.product_id,
                    bid.min_quantity,
                    bid.max_quantity,
                    bid.rate,
                    bid.amount,
                    bid.bid_date,
                    bid.bid_time
                ])
                .then((res) => {
                  if (shouldAbort(err, done)) {
                    callback(err, null);
                  }
                  let bid_id = res.rows[0].id;
                  var searchQuery = "select * from public.wallet where user_id=$1;";
                  client
                    .query(searchQuery,[bid.user_id])
                    .then((res) => {
                      // console.log(res);
                      if (res.rowCount == 0) {
                        callback("error", null);
                        client.query('ROLLBACK', err => {
                          if (err) {
                            console.error('Error rolling back client', err.stack)
                          }
                          done();
                          return;
                        })
                      } else {
                        let wallet = res.rows[0];

                        if(parseFloat(wallet.available_amt) < parseFloat(bid.amount)){
                          callback("error", null);
                          client.query('ROLLBACK', err => {
                            if (err) {
                              console.error('Error rolling back client', err.stack)
                            }
                            done()
                            return;
                          })
                        }
                        else{
                          let type = "block";
                          let amount  = bid.amount;
                          let wallet_id = wallet.id;
                          let desc = "bid:"+bid_id;
                          let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
                          let date = datetime.create();
                          let dt = date.format('Y-m-d');
                          let time = date.format('H:M:S');
                          client
                            .query(query,[
                              wallet.id,
                              type,
                              amount,
                              desc,
                              dt,
                              time,
                              "pending"
                            ])
                            .then((res1) => {
                              if (shouldAbort(err, done)) {
                                callback(err, null);
                              }
                            
                              let trans_id = res1.rows[0].id
                            
                                  var wallet_query = "select * from public.wallet where id=$1;";
                                  client
                                    .query(wallet_query, [wallet_id])
                                    .then((res_wallet) => {
                                      if (shouldAbort(err, done)) {
                                        callback(err, null);
                                      }
                                      // console.log(res);
                                      let wallet = res_wallet.rows[0];

                                      let final_available_amt;
                                      let final_blocked_amt;
                                    
                                      if(type == "credit"){
                                        final_available_amt = parseInt(wallet.available_amt) + parseInt(amount);
                                        final_blocked_amt = parseInt(wallet.blocked_amt);
                                      }
                                    
                                      else if(type == "debit"){
                                        final_available_amt = parseInt(wallet.available_amt) - parseInt(amount);
                                        final_blocked_amt = parseInt(wallet.blocked_amt);
                                      
                                      }
                                    
                                      else if(type == "block"){
                                        final_available_amt = parseInt(wallet.available_amt) - parseInt(amount);
                                        final_blocked_amt = parseInt(wallet.blocked_amt) + parseInt(amount);
                                      
                                      }
                                    
                                      else if(type == "unblock"){
                                        final_available_amt = parseInt(wallet.available_amt) + parseInt(amount);
                                        final_blocked_amt = parseInt(wallet.blocked_amt) - parseInt(amount);
                                      
                                      }
                                    
                                    
                                      var update_balance = "update public.wallet set available_amt = $1, blocked_amt = $2 where id = $3";
                                    
                                        client
                                          .query(update_balance, [final_available_amt,final_blocked_amt, wallet.id])
                                          .then((res) => {
                                            if (shouldAbort(err, done)) {
                                              callback(err, null);
                                            }
                                          
                                            let query = "update public.wallet_trans set trans_status = $1 where id = $2;";

                                              client
                                                .query(query, ["successfull", trans_id])
                                                .then((res) => {
                                                  if (shouldAbort(err, done)) {
                                                    callback(err, null);
                                                  }
                                                  client
                                                    .query("COMMIT")
                                                    .then(() => {
                                                      // console.log("commited");
                                                      callback(null, "done");
                                                    })
                                                    .catch((e) => {
                                                      callback(e, null);
                                                    });
                                                        // console.log(res);
                                                  
                                                })
                                                .catch((e) => {
                                                  console.log(e);
                                                  callback("error");
                                                });
                                              
                                              
                                            // console.log(res);
                                              
                                              
                                          })
                                          .catch((e) => {
                                            console.log(e);
                                            callback("error");
                                          });
                                        
                                        
                                    })
                                    .catch((e) => {
                                      console.log(e);
                                      callback("error");
                                    });
                                  
                                  
                            })
                            .catch((e) => {
                              console.log(e);
                              callback("error",null);
                            });
                        }

                      }
                    })
                    .catch((e) => {
                      console.log(e);
                      callback("error");
                    });

                  


                })
                .catch((e) => {
                  console.log(e);
                  callback("error");
                });
            })
            .catch((e) => {
              console.log(e);
              callback("error");
            });
          
          done();
        }); 
    }
}

module.exports = Bid;