const { pool, shouldAbort } = require("../conn");

class Warehouse {
  constructor(warehouse_name, user_id, phone, x, y, pincode, address) {
    this.warehouse_name = warehouse_name;
    this.user_id = user_id;
    this.phone = phone;
    this.x = x;
    this.y = y;
    this.pincode = pincode;
    this.address = address;
  }

  save(callback) {
    const queryText =
      "insert into public.warehouse(warehouse_name, user_id, phone, latitude, longitude, pincode, address) values ($1,$2,$3,$4,$5,$6,$7);";

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
              this.user_id,
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

  findById(id, callback) {
    var searchQuery =
      "select * from public.warehouse where id = any('{" + id[0];

    for (var i = 1; i < id.length; i++) {
      searchQuery += "," + id[i];
    }

    searchQuery += "}')";

    pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        callback(err, null);
      }

      client
        .query(searchQuery)
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

  findByPos(latitude, longitude, callback) {
    var searchQuery =
      "select * from public.warehouse order by |/ ((latitude-$1)^2 + (longitude-$2)^2) limit 5";
    pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        callback(err, null);
      }

      client
        .query(searchQuery, [latitude, longitude])
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

  findByPincode(pincode, callback) {
    var searchQuery = "select * from public.warehouse where pincode = $1";
    pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        callback(err, null);
      }

      client
        .query(searchQuery, [pincode])
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
