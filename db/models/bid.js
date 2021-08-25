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

    get_accepted(id, callback){
      console.log(id);
      var searchQuery = "SELECT * from public.bid where product_id=$1 and status='1' order by rate desc, max_quantity desc, bid_date asc, bid_time asc;";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(searchQuery,[id])
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

    get_by_product_id(id, callback){
      //console.log(id);
      var searchQuery = "SELECT * from public.bid where product_id=$1 order by rate desc, max_quantity desc, bid_date asc, bid_time asc;";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(searchQuery,[id])
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

    get_by_id(id, callback){
      var searchQuery = "SELECT * from public.bid where id=$1;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }

          client
            .query(searchQuery,[id])
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

    accept_bids(bids,reciever, callback){
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

              var bar = new Promise((resolve, reject) => {
                // bids.forEach((b, i)=>{
                //   console.log(b);
                this.trans(bids, 0, resolve, reject, client,err, done, reciever);
                // })
              });
            
              bar.then(() => {
                let product_id = bids[0].product_id;

                let query = "update public.products set result_status='1' where id = $1";

                client
                  .query(query, [product_id])
                  .then((res) => {
                    if (shouldAbort(err, done)) {
                      callback(err, null);
                    }
                    
                   query = "select * from public.bid where status='0' and product_id = $1";
                          // console.log(res);
                        client
                          .query(query, [product_id])
                          .then((res) => {
                            if (shouldAbort(err, done)) {
                              callback(err, null);
                            }
                            
                            var foo = new Promise((resolve, reject) => {
                              // bids.forEach((b, i)=>{
                              //   console.log(b);
                              this.unblock_money(res.rows, 0, resolve, reject, client,err, done);
                              // })
                            });
                                  // console.log(res);
                                  foo.then(() => {
                                    query = "update public.products set result_status='2' where id = $1";





                                    client
                                      .query(query, [ product_id])
                                      .then((res) => {
                                        if (shouldAbort(err, done)) {
                                          callback(err, null);
                                        }
                                        client
                                          .query("COMMIT")
                                          .then(() => {
                                            // console.log("commited");
                                            // callback(null, res.rows[0]);
                                            callback(null , "success");
                                          
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
                                    
                                  })  
                          
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
                


                console.log("resolve");
              });


            
        })
        .catch((e) => {
          console.log(e);
          callback("error");
        });
        done();
        });

        
    }



    unblock_money(bids, i, resolve, reject, client,err, done){
      let bid = bids[i];
      var wallet_query = "select * from public.wallet where user_id=$1;";
      let query = "update public.bid set status='2' where id=$1";

      client
        .query(query, [bid.id])
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
      client
        .query(wallet_query, [bid.user_id])
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
          if (res.rowCount == 0) {
            callback("fatal err", null);
            client.query('ROLLBACK', err => {
              if (err) {
                console.error('Error rolling back client', err.stack)
              }
              done()
              return;
            })
          }
          else{
            this.quick_transact(res.rows[0].id, bid.amount, "unblock" , "refund_bid:"+bid.id, client,err, done,(err, done)=>{
              if(err){
                callback(err, null);
              }
              else{
                // console.log("unblocked "+bid.amount);
               
                if(bids.length-1 == i ){
                  resolve()
                  
                }
                else{
                  this.unblock_money(bids, i+1, resolve, reject, client,err, done);
                }
              }
            })
          }
          
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


    }

    trans(bids, i, resolve, reject, client, err, done, reciever){
      var query = "update public.bid set alloted = $1, status = $2 where id = $3";

      let b = bids[i];
      client
              .query(query,[parseInt(b.alloted), b.status, b.id])
              .then((res) => {
                // console.log("q1");
                if (shouldAbort(err, done)) {
                  callback(err, null);
                }
                var wallet_query = "select * from public.wallet where user_id=$1;";
                client
                .query(wallet_query,[b.user_id])
                .then((sender_wallet) => {
                  // console.log("q2");

                  // console.log(res);
                  if (res.rowCount == 0) {
                    callback("fatal err", null);
                    client.query('ROLLBACK', err => {
                      if (err) {
                        console.error('Error rolling back client', err.stack)
                      }
                      done()
                      return;
                    })
                  } else {
                    if (shouldAbort(err, done)) {
                      callback(err, null);
                    }
                    let sender = sender_wallet.rows[0].id;
                    let transfer_amount = parseInt(b.alloted)*parseFloat(b.rate);
                    let refund_amount = parseFloat(b.amount) - transfer_amount;
                    let desc = "accept_bid:"+b.id;
                    
                    this.blocked_transfer(sender, reciever, transfer_amount, desc,client,err,done, (err,sucess)=>{
                      if(err){
                        callback(err, null);
                      }
                      else{
                        // console.log("transferred " + transfer_amount);
                        if(refund_amount > 0){
                          this.quick_transact(sender, refund_amount, "unblock", "bid:"+b.id,client,err,done, (err, success)=>{
                            if(err){
                              callback(err, null);
                            }
                            else{
                             
                              if(bids.length-1 == i ){
                                resolve()
                                
                              }
                              else{
                                this.trans(bids, i+1, resolve, reject, client, err, done, reciever);
                              }
                            }
                          })
                        }
                        else{
                          
                          if(bids.length-1 == i ){
                            resolve()
                           
                          }
                          else{
                            this.trans(bids, i+1, resolve, reject, client, err, done, reciever);
                          }
                        }
                      }
                    })


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
    }

    quick_transact(wallet_id,amount,type,desc,client,err,done, callback){
      // console.log("f2");

      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        
          client
            .query(query,[
              wallet_id,
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
                                  callback(null, res);
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

    blocked_transfer(sender, reciever, amount, desc,client,err,done, callback){
      // console.log("f1");

      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        
          client
            .query(query,[
              sender,
              "transfer_debit",
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

              let query = "INSERT INTO public.wallet_trans(id, wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7, $8) returning id;"

              client
              .query(query,[
                trans_id,
                reciever,
                "transfer_credit",
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
              
                  var wallet_query = "select * from public.wallet where id=$1;";
                  client
                    .query(wallet_query, [sender])
                    .then((res_wallet) => {
                      if (shouldAbort(err, done)) {
                        callback(err, null);
                      }
                      // console.log(res);
                      let sender_wallet = res_wallet.rows[0];
                      
                      client
                        .query(wallet_query, [reciever])
                        .then((res_wallet) => {
                          if (shouldAbort(err, done)) {
                            callback(err, null);
                          }
                          // console.log(res);
                          let reciever_wallet = res_wallet.rows[0];

                          let sender_final_balance = parseInt(sender_wallet.blocked_amt) - parseInt(amount);
                          
                          let reciever_final_balance = parseInt(reciever_wallet.available_amt) + parseInt(amount);

                          var update_sender_balance = "update public.wallet set blocked_amt = $1 where id = $2";
                          var update_reciever_balance = "update public.wallet set available_amt = $1 where id = $2";
                          client
                            .query(update_sender_balance, [sender_final_balance, sender])
                            .then((res) => {
                              if (shouldAbort(err, done)) {
                                callback(err, null);
                              }

                              
                              client
                              .query(update_reciever_balance, [reciever_final_balance, reciever])
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
                                      callback(null, res);
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
                      callback("error");
                    });
      
              
            })
            
            .catch((e) => {
              callback(e, null);
            });
          })
            .catch((e) => {
              console.log(e);
              callback("error",null);
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