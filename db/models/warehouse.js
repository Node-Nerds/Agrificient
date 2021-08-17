const { pool, shouldAbort } = require("../conn");

class Warehouse {
  constructor(warehouse_name, phone, x, y, pincode, address) {
    this.warehouse_name = warehouse_name;
    this.phone = phone;
    this.x = x;
    this.y = y;
    this.pincode = pincode;
    this.address = address;
  }

  save(callback) {
    const queryText =
      "insert into agrificient.warehouse(warehouse_name, phone, x, y, pincode, address) values ($1,$2,$3,$4,$5,$6);";

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
              this.warehouse_name,
              this.phone,
              this.x,
              this.y,
              this.pincode,
              this.address,
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

  find(callback) {
    var searchQuery = "select * from agrificient.warehouse;";
    pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        callback(err, null);
      }

      client
        .query(searchQuery)
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

module.exports = Warehouse;
