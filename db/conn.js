const { Pool, Client } = require("pg");
const connectionString =
  "postgres://" +
  process.env.PGUSER +
  ":" +
  process.env.PGPASSWORD +
  "@" +
  process.env.PGHOST +
  ":" +
  process.env.PGPORT +
  "/" +
  process.env.PGDATABASE +
  "?";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 50,
  idleTimeoutMillis: 50000,
  connectionTimeoutMillis: 20000,
});

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

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
