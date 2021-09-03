const { Pool, Client } = require("pg");

const pool = new Pool();

const client = new Client();

pool.query("select now();", async (err, res) => {
  if (err) {
    console.log(err);
  }
  if (res) {
    console.log("PostgresSQL connected sucesfully");
  }
});

const shouldAbort = (err, done) => {
  if (err) {
    console.error("Error in transaction", err.stack);
    client.query("ROLLBACK", (err) => {
      if (err) {
        console.error("Error rolling back client", err.stack);
      }
      done();
    });
  }
  return !!err;
};

module.exports = { pool, shouldAbort };
