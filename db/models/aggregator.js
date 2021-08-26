const { pool, shouldAbort } = require("../conn");

class Aggregator {
  constructor(
    aggregator_name,
    user_id,
    phone,
    x,
    y,
    pincode,
    address,
    description,
    whatsapp
  ) {
    this.aggregator_name = aggregator_name;
    this.user_id = user_id;
    this.phone = phone;
    this.x = x;
    this.y = y;
    this.pincode = pincode;
    this.address = address;
    this.description = description;
    this.whatsapp = whatsapp;
  }

  save(callback) {
    const queryText =
      "insert into public.aggregator(aggregator_name, user_id, phone, latitude, longitude, pincode, address, description, whatsapp) values ($1,$2,$3,$4,$5,$6,$7,$8,$9);";

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
              this.aggregator_name,
              this.user_id,
              this.phone,
              this.x,
              this.y,
              this.pincode,
              this.address,
              this.description,
              this.whatsapp,
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

  // findById(id, callback) {
  //   var searchQuery = "select * from public.aggregator where id = $1";

  //   pool.connect((err, client, done) => {
  //     if (shouldAbort(err, done)) {
  //       callback(err, null);
  //     }

  //     client
  //       .query(searchQuery, [id])
  //       .then((res) => {
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

  // findByUserId(id, callback) {
  //   var searchQuery = "select * from public.aggregator where user_id = $1";

  //   pool.connect((err, client, done) => {
  //     if (shouldAbort(err, done)) {
  //       callback(err, null);
  //     }

  //     client
  //       .query(searchQuery, [id])
  //       .then((res) => {
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

  findByPos(latitude, longitude, callback) {
    var searchQuery =
      "select * from public.aggregator order by |/ ((latitude-$1)^2 + (longitude-$2)^2) limit 5";
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
    var searchQuery = "select * from public.aggregator where pincode = $1";
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
}

module.exports = Aggregator;
