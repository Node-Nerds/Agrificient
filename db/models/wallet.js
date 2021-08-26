const { pool, shouldAbort } = require("../conn");
const User = require("./user")
const datetime = require('node-datetime');

class Wallet{
    constructor(id, user_id, available_amt, blocked_amt){
        this.id = id;
        this.user_id = user_id;
        this.available_amt = available_amt;
        this.blocked_amt = blocked_amt;
    }

    get_by_user_id(user_id,callback){
        var searchQuery = "select * from public.wallet where user_id=$1;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }

          client
            .query(searchQuery,[user_id])
            .then((res) => {
              // console.log(res);
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

    get_sender_info(id, callback){
      var searchQuery = "select * from public.wallet_trans where id=$1;";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(searchQuery,[id])
          .then((res) => {
            if (shouldAbort(err, done)) {
              callback(err, null);
            }
            // console.log(res);
            if (res.rowCount == 0) {
              callback("no such transaction", null);
            } 
            else {
              searchQuery = "select * from public.wallet where id=$1;";
              client
                .query(searchQuery,[res.rows[0].wallet_id])
                .then((res) => {
                  if (res.rowCount == 0) {
                    callback("error", null);
                    return;
                  } 
                  // console.log(res);
                  let user = new User();
                  

                  user.findbyId(res.rows[0].user_id, (err, found)=>{
                    if(err){
                      callback(err, null);
                    }
                    else{
                      
                      if(found != null){
                        if(found.rowCount == 0)
                        callback("no user found", null);
                      
                      else{
                        callback(null, {
                          fname : found[0].fname,
                          lname : found[0].lname,
                          phno : found[0].phno
                        })
                      }
                    }
                    else{
                      callback("no user found", null);
                    }

                    }
                  })
                })
                .catch((e) => {
                  console.log(e);
                  callback("error");
                });
            }
          })
          .catch((e) => {
            console.log(e);
            callback("error");
          });
        done();
      });
    }

    transaction_history(id, callback){
      var searchQuery = "select * from public.wallet_trans where wallet_id=$1 order by trans_date desc, trans_time desc;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }

          client
            .query(searchQuery,[id])
            .then((res) => {
              // console.log(res);
              
                callback(null, res.rows);
              
            })
            .catch((e) => {
              console.log(e);
              callback("error");
            });
          done();
        });
    }

    get_by_phone_no(phno, callback){
        let user = new User();

        user.findByPhno(phno, (err, found)=>{
          if(err){
            callback(err, null);
          }
          else{
            console.log(found); 
            if(found != null){
              if(found.rowCount == 0)
              callback("no user found", null);
            
            else{
              this.get_by_user_id(found[0].id, (err, found1)=>{
                if(err){
                    callback(err,null);
                }
                else{
                  callback(null, found1);
                }
            })
            }
          }
          else{
            callback("no user found", null);
          }
            
          }
        })
    }


    withdraw_money(wallet_id,amount, callback){
      
      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        client
        .query("BEGIN")
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
          client
            .query(query,[
              wallet_id,
              "debit",
              amount,
              "withdraw margin",
              dt,
              time,
              "pending"
            ])
            .then((res1) => {
              if (shouldAbort(err, done)) {
                callback(err, null);
              }
              // console.log(res);
              client
                .query("COMMIT")
                .then(() => {
                  // console.log("commited");
                  callback(null, res1.rows);
                })
                .catch((e) => {
                  callback(e, null);
                });
            })
            .catch((e) => {
              console.log(e);
              callback("error",null);
            });
          })
          .catch((e) => {
            callback(e, null);
          });
        done();
      });
    }

    

    quick_transact(wallet_id,amount,type,desc, callback){
      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        client
        .query("BEGIN")
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
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
          })
          .catch((e) => {
            callback(e, null);
          });
        done();
      });
    }



    add_money(wallet_id,amount, callback){
      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        client
        .query("BEGIN")
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
          client
            .query(query,[
              wallet_id,
              "credit",
              amount,
              "add margin",
              dt,
              time,
              "pending"
            ])
            .then((res1) => {
              if (shouldAbort(err, done)) {
                callback(err, null);
              }
              // console.log(res);
              client
                .query("COMMIT")
                .then(() => {
                  // console.log("commited");
                  callback(null, res1.rows);
                })
                .catch((e) => {
                  callback(e, null);
                });
            })
            .catch((e) => {
              console.log(e);
              callback("error",null);
            });
          })
          .catch((e) => {
            callback(e, null);
          });
        done();
      });
    }

    get_pending_trans(callback){
      var searchQuery = "select * from public.wallet_trans where trans_status='pending';";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }

          client
            .query(searchQuery)
            .then((res) => {
              // console.log(res);
              
              if(res.rowCount == 0){
                callback(null, "no pending transactions");
              }
              else{
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

    normal_transfer(sender, reciever, amount, desc, callback){
      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        client
        .query("BEGIN")
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
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

                          let sender_final_balance = parseInt(sender_wallet.available_amt) - parseInt(amount);
                          
                          let reciever_final_balance = parseInt(reciever_wallet.available_amt) + parseInt(amount);

                          var update_balance = "update public.wallet set available_amt = $1 where id = $2";

                          client
                            .query(update_balance, [sender_final_balance, sender])
                            .then((res) => {
                              if (shouldAbort(err, done)) {
                                callback(err, null);
                              }

                              
                              client
                              .query(update_balance, [reciever_final_balance, reciever])
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
          })
          .catch((e) => {
            callback(e, null);
          });
        done();
      });
    }


    blocked_transfer(sender, reciever, amount, desc, callback){
      let query = "INSERT INTO public.wallet_trans( wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) VALUES ( $1, $2, $3, $4, $5,$6, $7) returning id;"
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        let date = datetime.create();
        let dt = date.format('Y-m-d');
        let time = date.format('H:M:S');
        client
        .query("BEGIN")
        .then((res) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
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
          })
          .catch((e) => {
            callback(e, null);
          });
        done();
      });
    }

    update_trans_status(id, status, callback){
      if(status == "successfull"){
        var searchQuery = "select * from public.wallet_trans where id = $1;";
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
              .query(searchQuery, [id])
              .then((res) => {
                // console.log(res);
                if (shouldAbort(err, done)) {
                  callback(err, null);
                }
                if(res.rowCount == 0){
                  callback(null, "no pending transactions");
                }

                else{
                  let trans = res.rows[0];
                  var wallet_query = "select * from public.wallet where id=$1;";
                  client
                    .query(wallet_query, [trans.wallet_id])
                    .then((res_wallet) => {
                      if (shouldAbort(err, done)) {
                        callback(err, null);
                      }
                      // console.log(res);
                      let wallet = res_wallet.rows[0];
                      
                      let final_amt;

                      if(trans.transaction_type == "credit"){
                        final_amt = parseInt(wallet.available_amt) + parseInt(trans.transaction_amt);
                      }

                      else if(trans.transaction_type == "debit"){
                        final_amt = parseInt(wallet.available_amt) - parseInt(trans.transaction_amt);
                      }


                      var update_balance = "update public.wallet set available_amt = $1 where id = $2";

                        client
                          .query(update_balance, [final_amt, wallet.id])
                          .then((res) => {
                            if (shouldAbort(err, done)) {
                              callback(err, null);
                            }

                            let query = "update public.wallet_trans set trans_status = $1 where id = $2;";
                            
                              client
                                .query(query, [status, id])
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
                }

              })
              .catch((e) => {
                console.log(e);
                callback("error");
              });

            })
            .catch((e) => {
              callback(e, null);
            });
          done();
        });
      }
      else{
        let query = "update public.wallet_trans set trans_status = $1 where id = $2;";
        pool.connect((err, client, done) => {
          if (shouldAbort(err, done)) {
            callback(err, null);
          }
          client
            .query(query, [status, id])
            .then((res) => {
              // console.log(res);
              callback(null, "done")
            
            })
            .catch((e) => {
              console.log(e);
              callback("error");
            });
          });

      }
      
    }
}

module.exports = Wallet;