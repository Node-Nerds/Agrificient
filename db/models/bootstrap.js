const { pool, shouldAbort } = require("../conn");

function bootstrap(callback){
    let query = "CREATE  TABLE  if not exists public.users ( "+
        "id                   uuid DEFAULT uuid_generate_v4() NOT NULL,"+
        "aadhar_no            varchar(12)  NOT NULL ,"+
        "pan_no               varchar(10)   ,"+
        "password           varchar(512)  NOT NULL ,"+
        "fname                varchar(100)  NOT NULL ,"+
        "lname                varchar(100)  NOT NULL ,"+
        "phno                 varchar(13)  NOT NULL ,"+
        "no_rating            bigint DEFAULT 0 NOT NULL ,"+
        "user_rating          bigint DEFAULT 0 NOT NULL ,"+
        "CONSTRAINT pk_users_id PRIMARY KEY ( id ),"+
        "CONSTRAINT idx_users_phno UNIQUE ( phno ) ,"+
        "CONSTRAINT idx_users_aadhar UNIQUE ( aadhar_no ) ,"+
        "CONSTRAINT idx_users_pan UNIQUE ( pan_no ) "+
     ");"
    pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        client
          .query(query)
          .then((res) => {
            // console.log(res);
            if (res.rowCount == 0) {
              callback(null, null);
            } else {
        query = "CREATE  TABLE if not exists public.wallet  ( id                   uuid DEFAULT uuid_generate_v4() NOT NULL ,user_id              uuid  NOT NULL ,available_amt        numeric(12,2)  NOT NULL ,blocked_amt          numeric(12,2)  NOT NULL ,CONSTRAINT pk_wallet_wallet_id PRIMARY KEY ( id ),CONSTRAINT unq_wallet UNIQUE ( user_id ) );"
        let alter_query = "ALTER TABLE public.wallet DROP CONSTRAINT IF EXISTS fk_wallet_users";

        let alter_query1 = "ALTER TABLE public.wallet ADD CONSTRAINT  fk_wallet_users FOREIGN KEY ( user_id ) REFERENCES public.users( id ) ON DELETE CASCADE ON UPDATE CASCADE;" 
        
        
        client
          .query(query)
          .then((res) => {
            // console.log(res);
            if (res.rowCount == 0) {
              callback(null, null);
            } else {

                client
                .query(alter_query)
                .then((res) => {
                  // console.log(res);
                  if (res.rowCount == 0) {
                    callback(null, null);
                  } else {
      
                    client
                        .query(alter_query1)
                        .then((res) => {
                          // console.log(res);
                          if (res.rowCount == 0) {
                            callback(null, null);
                          } else {
                        
                            query = "CREATE  TABLE if not exists public.wallet_trans ( id                   uuid DEFAULT uuid_generate_v4() NOT NULL ,wallet_id            uuid  NOT NULL ,transaction_type     public.transaction_type  NOT NULL ,transaction_amt      numeric(12,2)  NOT NULL ,description          varchar(100)   ,trans_date           date  NOT NULL ,trans_time           time  NOT NULL ,trans_status         public.trans_status  NOT NULL ,CONSTRAINT pk_wallet_trans PRIMARY KEY ( id, wallet_id ));";
                            alter_query = "ALTER TABLE public.wallet_trans DROP CONSTRAINT if exists fk_wallet_transactions_wallet"
                            alter_query1 = "ALTER TABLE public.wallet_trans ADD CONSTRAINT fk_wallet_transactions_wallet FOREIGN KEY ( wallet_id ) REFERENCES public.wallet( id ) ON DELETE CASCADE ON UPDATE CASCADE;"
                          
                            client
                                .query(query)
                                .then((res) => {
                                  // console.log(res);
                                  if (res.rowCount == 0) {
                                    callback(null, null);
                                  } else {
                                
                                    client
                                    .query(alter_query)
                                    .then((res) => {
                                      // console.log(res);
                                      if (res.rowCount == 0) {
                                        callback(null, null);
                                      } else {
                                    
                                        client
                                    .query(alter_query1)
                                    .then((res) => {
                                      // console.log(res);
                                      if (res.rowCount == 0) {
                                        callback(null, null);
                                      } else {

                                        query = "CREATE  TABLE if not exists public.products ( id                   uuid DEFAULT uuid_generate_v4() NOT NULL ,user_id              uuid  NOT NULL ,product_name         varchar(100)  NOT NULL ,quantity             bigint  NOT NULL ,unit                 public.quantity_unit  NOT NULL ,base_price           numeric(12,2)  NOT NULL ,description          varchar(256)  NOT NULL ,start_dt             date  NOT NULL ,end_dt               date  NOT NULL ,pin_code             numeric(6,0)  NOT NULL ,city                 varchar(64)  NOT NULL ,state_name           varchar(64)  NOT NULL ,result_status        char(1) DEFAULT 0 NOT NULL ,rating               numeric(5,1) DEFAULT 0 NOT NULL ,no_rating            bigint DEFAULT 0 NOT NULL ,district             varchar(64)  NOT NULL ,product_cat          public.product_types  NOT NULL ,latitude             numeric   ,longitude            numeric   ,CONSTRAINT pk_bid_id PRIMARY KEY ( id ));"
                                        alter_query = "ALTER TABLE public.products DROP CONSTRAINT if exists fk_bid_users"
                                        alter_query1 = "ALTER TABLE public.products ADD CONSTRAINT fk_bid_users FOREIGN KEY ( user_id ) REFERENCES public.users( id ) ON DELETE CASCADE ON UPDATE CASCADE;"

                                        client
                                        .query(query)
                                        .then((res) => {
                                          // console.log(res);
                                          if (res.rowCount == 0) {
                                            callback(null, null);
                                          } else {
                                        
                                            client
                                            .query(alter_query)
                                            .then((res) => {
                                              // console.log(res);
                                              if (res.rowCount == 0) {
                                                callback(null, null);
                                              } else {
                                            
                                                client
                                            .query(alter_query1)
                                            .then((res) => {
                                              // console.log(res);
                                              if (res.rowCount == 0) {
                                                callback(null, null);
                                              } else {

                                                // callback(null, res);
                                                query =  "CREATE  TABLE IF NOT EXISTS public.bid ( id                   uuid DEFAULT uuid_generate_v4() NOT NULL ,user_id              uuid  NOT NULL ,product_id           uuid  NOT NULL ,min_quantity         bigint  NOT NULL ,max_quantity         bigint  NOT NULL ,rate                 numeric(12,2)  NOT NULL ,amount               numeric(12,2)  NOT NULL ,bid_date             date  NOT NULL ,bid_time             time  NOT NULL ,status               char(1) DEFAULT 0 NOT NULL ,CONSTRAINT pk_bid_id_0 PRIMARY KEY ( id ) );"
                                                alter_query = "ALTER TABLE public.bid DROP CONSTRAINT IF EXISTS fk_bid_users" 
                                                let alter_query2 = "ALTER TABLE public.bid ADD CONSTRAINT fk_bid_users FOREIGN KEY ( user_id ) REFERENCES public.users( id ) ON DELETE CASCADE ON UPDATE CASCADE;"
                                                alter_query1 = "ALTER TABLE public.bid DROP CONSTRAINT IF EXISTS fk_bid_products"
                                                let alter_query3 = "ALTER TABLE public.bid ADD CONSTRAINT fk_bid_products FOREIGN KEY ( product_id ) REFERENCES public.products( id ) ON DELETE CASCADE ON UPDATE CASCADE;"
                                                client
                                        .query(query)
                                        .then((res) => {
                                          // console.log(res);
                                          if (res.rowCount == 0) {
                                            callback(null, null);
                                          } else {
                                        
                                            client
                                            .query(alter_query)
                                            .then((res) => {
                                              // console.log(res);
                                              if (res.rowCount == 0) {
                                                callback(null, null);
                                              } else {
                                            
                                                client
                                            .query(alter_query1)
                                            .then((res) => {
                                              // console.log(res);
                                              if (res.rowCount == 0) {
                                                callback(null, null);
                                              } else {
                                                
                                                // callback(null, res);
                                                client.query(alter_query2)
                                            .then((res) => {
                                              // console.log(res);
                                              if (res.rowCount == 0) {
                                                callback(null, null);
                                              } else {
                                            
                                                client
                                            .query(alter_query3)
                                            .then((res) => {
                                              // console.log(res);
                                              if (res.rowCount == 0) {
                                                callback(null, null);
                                              } else {
                                                
                                                callback(null, res);
        
                                            
                                            }
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

                                            
                                            }
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
        
                                        
                                        }
                                        })
                                        .catch((e) => {
                                          console.log(e);
                                          callback("error");
                                        });
                                                
        
                                            
                                            }
                                            })
                                            .catch((e) => {
                                              // //console.log(e);
                                              callback("error");
                                            });
                                                
        
                                            
                                            }
                                            })
                                            .catch((e) => {
                                              // //console.log(e);
                                              callback("error");
                                            });
        
                                        
                                        }
                                        })
                                        .catch((e) => {
                                          // //console.log(e);
                                          callback("error");
                                        });
                                        
                                        

                                    
                                    }
                                    })
                                    .catch((e) => {
                                      // //console.log(e);
                                      callback("error");
                                    });
                                        

                                    
                                    }
                                    })
                                    .catch((e) => {
                                      // //console.log(e);
                                      callback("error");
                                    });

                                
                                }
                                })
                                .catch((e) => {
                                  //console.log(e);
                                  callback("error");
                                });

                        }
                        })
                        .catch((e) => {
                          //console.log(e);
                          callback("error");
                        });
                  }
                })
                .catch((e) => {
                  //console.log(e);
                  callback("error");
                });
            }
          })
          .catch((e) => {
            //console.log(e);
            callback("error");
          });
        }
      })
      .catch((e) => {
        //console.log(e);
        callback("error");
      });
        done();
    });
}

function bootstrap_enum(callback){
    pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
        
        let query  = "CREATE TYPE public.product_types AS ENUM ('vegetables', 'milk', 'poultry', 'cotton', 'groundnuts', 'soyabean', 'sunflower', 'rice', 'wheat', 'juwar', 'bajra', 'ragi', 'gram', 'chana', 'maize', 'spices', 'grains', 'misc');"
        
        client
          .query(query)
          .then((res) => {
            // console.log(res);
            if (res.rowCount == 0) {
              callback(null, null);
            } else {
                let query  = "CREATE TYPE public.quantity_unit AS ENUM('kg', 'mt', 'qtl');"
                client
                  .query(query)
                  .then((res) => {
                    // console.log(res);
                    if (res.rowCount == 0) {
                      callback(null, null);
                    } else {
                        let query  = "CREATE TYPE public.trans_status AS ENUM('pending', 'successfull', 'cancelled', 'failed');"
                        client
                          .query(query)
                          .then((res) => {
                            // console.log(res);
                            if (res.rowCount == 0) {
                              callback(null, null);
                            } else {
                                let query  = "CREATE TYPE public.transaction_type AS ENUM ('debit', 'credit', 'block', 'unblock', 'transfer_credit', 'transfer_debit');"
                                client
                                  .query(query)
                                  .then((res) => {
                                    // console.log(res);
                                    if (res.rowCount == 0) {
                                      callback(null, null);
                                    } else {
                                        callback(null, res);
                                  }})
                                  .catch((e) => {
                                    //console.log(e);
                                    callback("error");
                                  });
                          }})
                          .catch((e) => {
                            //console.log(e);
                            callback("error");
                          });
                  }})
                  .catch((e) => {
                    //console.log(e);
                    callback("error");
                  });

          }})
          .catch((e) => {
            //console.log(e);
            callback("error");
          });
        done();
    });
}

module.exports = {bootstrap, bootstrap_enum};    

