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
      "insert into public.proposal(user_id, warehouse_id, start_date, end_date, quantity, current_status) values ($1,$2,$3,$4,$5,$6);";

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
              "pending",
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

  findInbox(id, callback) {
    var searchQuery =
      "select p.id,fname,warehouse_name,start_date,end_date,quantity,current_status,phno from public.proposal as p INNER JOIN public.users as u ON p.user_id = u.id  INNER JOIN public.warehouse as w ON p.warehouse_id = w.id where p.warehouse_id IN (select id from public.warehouse where user_id = $1)";
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

  findMyProposal(id, callback) {
    var searchQuery =
      "select * from public.proposal as p INNER JOIN public.warehouse as w on p.warehouse_id = w.id where p.user_id = $1";
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

  approve(id, callback) {
    var searchQuery =
      "update public.proposal set current_status = 'approved' where id = $1";
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
}

module.exports = Proposal;
