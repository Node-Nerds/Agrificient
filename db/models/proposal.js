const { pool, shouldAbort } = require("../conn");

class Proposal {
  constructor(user_id, warehouse_id, start_date, end_date, quantity) {
    this.user_id = user_id;
    this.warehouse_id = warehouse_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.quantity = quantity;
  }

  save(callback) {
    const queryText =
      "insert into public.proposal(user_id, warehouse_id, start_date, end_date, quantity, status) values ($1,$2,$3,$4,$5,$6);";

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
              this.user_id,
              this.warehouse_id,
              this.start_date,
              this.end_date,
              this.quantity,
              0,
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
      done();
    });
  }

  findById(id, callback) {
    var searchQuery = "select * from public.proposal where user_id = $1";
    pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        callback(err, null);
      }

      client
        .query(searchQuery, [id])
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

  // findByPincode(pincode, callback) {
  //   var searchQuery = "select * from agrificient.warehouse where pincode = $1";
  //   pool.connect((err, client, done) => {
  //     if (shouldAbort(err, done)) {
  //       callback(err, null);
  //     }

  //     client
  //       .query(searchQuery, [pincode])
  //       .then((res) => {
  //         // console.log(res);
  //         if (res.rowCount == 0) {
  //           callback(null, null);
  //         } else {
  //           callback(null, res.rows);
  //         }
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         callback("error");
  //       });
  //     done();
  //   });
  // }

  //   fetchByYear(callback) {
  //     var searchQuery =
  //       "select * from finportal.bank_statement_personal where for_year=$1 and user_id=$2;";
  //     pool.connect((err, client, done) => {
  //       if (shouldAbort(err, done)) {
  //         callback(err, null);
  //       }

  //       client
  //         .query(searchQuery, [this.for_year, this.user_id])
  //         .then((res) => {
  //           if (res.rowCount == 0) {
  //             callback(null, null);
  //           } else {
  //             callback(null, res.rows);
  //           }
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //           callback("error");
  //         });
  //       done();
  //     });
  //   }

  //   update(callback) {
  //     var queryText =
  //       "Update finportal.bank_statement_personal set stat=$1 where user_id=$2 and for_year=$3";
  //     pool.connect((err, client, done) => {
  //       if (shouldAbort(err, done)) {
  //         callback(err, null);
  //       }

  //       client
  //         .query(queryText, [this.stat, this.user_id, this.for_year])
  //         .then((res) => {
  //           if (shouldAbort(err, done)) {
  //             callback(err, null);
  //           }

  //           client
  //             .query("COMMIT")
  //             .then(() => {
  //               callback(null, res.rows[0]);
  //             })
  //             .catch((e) => {
  //               callback(e, null);
  //             });
  //         })
  //         .catch((e) => {
  //           callback(e, null);
  //         });
  //     });
  //   }
}

module.exports = Proposal;
