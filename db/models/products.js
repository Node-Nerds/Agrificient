const { pool, shouldAbort } = require("../conn");
const bcrypt = require("bcrypt");
const datetime = require('node-datetime');

class Products{
    get_product_cat(callback){
        var searchQuery = "SELECT enum_range(NULL::product_types);";
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

    add_product(product,callback){
      let queryText =
      "INSERT INTO public.products"+
      "( user_id, product_name, product_cat, quantity, unit, base_price, description, start_dt, end_dt, latitude, longitude, pin_code, city, district, state_name"
      +") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) returning id;";
    
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
            .query(queryText,[
              product.user_id,
              product.product_name,
              product.product_cat,
              product.quantity,
              product.unit,
              product.basePrice,
              product.description,
              product.start_dt,
              product.end_dt,
              product.latitude,
              product.longitude,
              product.pincode,
              product.city,
              product.district,
              product.state
            ])
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

    fetch_product_by_id(id, callback){
      let query = "select * from public.products where id = $1;";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(query, [id])
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

    fetch_user_products(user_id,callback){

      let query = "select * from public.products where user_id = $1;";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(query, [user_id])
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

    fetch_open_bids(callback){
      function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
      }
      
      let date = formatDate(new Date());
      

      let query = "select * from public.products where start_dt <= $1 and end_dt >= $1;";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(query, [date])
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

    fetch_open_by_pos(lat, long, user_id,callback){
      console.log(typeof(lat) ,long);
      function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
      }
      
      let date = formatDate(new Date());
      var searchQuery =
      "select * from public.products where start_dt <= $1 and end_dt >= $1 and user_id != $4 order by sqrt(pow(latitude-$2,2) + pow(longitude-$3, 2));";
    
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }

        client
          .query(searchQuery, [date, lat, long, user_id])
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

    fetch_open_by_pin(pincode,user_id, callback) {
      function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
      }
      
      let date = formatDate(new Date());
      var searchQuery = "select * from public.products where pin_code = $1 and start_dt <= $2 and end_dt >= $2 and user_id != $3";
      pool.connect((err, client, done) => {
        if (shouldAbort(err, done)) {
          callback(err, null);
        }
  
        client
          .query(searchQuery, [pincode, date, user_id])
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

module.exports = Products;