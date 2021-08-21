const { pool, shouldAbort } = require("../conn");
const bcrypt = require("bcrypt");
const datetime = require('node-datetime');

class User {
  constructor(fname, lname, phno, aadhar_no, pan_no, password) {
    this.fname = fname;
    this.lname = lname;
    this.phno = phno;
    this.aadhar_no = aadhar_no;
    this.pan_no = pan_no;
    this.password = password;
  }

  save(callback) {
    let queryText =
      "insert into public.users(fname, lname, phno, aadhar_no, password) values ($1,$2,$3,$4,$5) returning id;";

    this.password = bcrypt.hashSync(this.password, 12);
    
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
            .query(queryText, [
              this.fname,
              this.lname,
              this.phno,
              this.aadhar_no,
              this.password
            ])
            .then((res) => {
              if (shouldAbort(err, done)) {
                callback(err, null);
              }
              let create_wallet = "insert into public.wallet(user_id, available_amt, blocked_amt) values ($1,$2,$3) returning id;";
              client
                .query(create_wallet, [
                  res.rows[0].id,
                  process.env.INITIALBALANCE,
                  0
                ])
                .then((res1) => {
                  if (shouldAbort(err, done)) {
                    callback(err, null);
                  }
                  let date = datetime.create();
                  let dt = date.format('Y-m-d');
                  let time = date.format('H:M:S');
                  let inital_balance = "insert into public.wallet_trans(wallet_id, transaction_type, transaction_amt, description, trans_date, trans_time, trans_status) values ($1,$2,$3,$4,$5,$6,$7) returning id;";
                    client
                      .query(inital_balance, [
                        res1.rows[0].id,
                        "credit",
                        process.env.INITIALBALANCE,
                        "Initial margin",
                        dt,
                        time,
                        "successfull"
                      ])
                      .then((res) => {
                        if (shouldAbort(err, done)) {
                          callback(err, null);
                        }
                    
                        client
                          .query("COMMIT")
                          .then(() => {
                            // console.log("commited");
                            callback(null, res.rows[0]);
                          })
                          .catch((e) => {
                            callback(e, null);
                          });
                      })
                      .catch((e) => {
                        callback(e, null);
                      });

                })
                .catch((e) => {
                  callback(e, null);
                });
              
            })
            .catch((e) => {
              callback(e, null);
            });
        })
        .catch((e) => {
          callback(e, null);
        });
      done();
    });
  }

  findByPhno(phno,callback){
    var searchQuery = "select * from public.users where phno=$1;";
    pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        callback(err, null);
      }

      client
        .query(searchQuery,[phno])
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

  findbyId(id,callback){
    var searchQuery = "select * from public.users where id=$1;";
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

}

module.exports = User;
