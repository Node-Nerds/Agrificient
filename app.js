require("dotenv").config();
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
var cors = require("cors");
var flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const ejs  = require("ejs");

const routes = require("./routes/");
require("./db/conn.js");

const { pool, shouldAbort } = require("./db/conn");

// Configuring the express app
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.set('view engine', 'ejs');
app.use(flash());

app.use(bodyParser.json());

app.use(express.static("public"));

passport.use("local",new LocalStrategy((username, password, cb) => {
  pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        cb(err);
      }
        client
        .query("select * from public.users where phno=$1;",[username])
        .then((res) => {
          // console.log(res);
          if (res.rowCount == 0) {
              cb(null, false, {message: 'User not found'});
          }
          else {
              const first = res.rows[0]
              
              bcrypt.compare(password, first.password, function(err, res) {
                  if(res) {
                    delete first.password;
                    cb(null,first)
                   } else {
                    cb(null, false, {message: 'Incorrect password'})
                  }
              })
          }
        })
        .catch((e) => {
          cb(e);
        });
      done();
  });
  
}));

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, cb) => {
  pool.connect((err, client, done) => {
      if (shouldAbort(err, done)) {
        cb(err);
      }

        client
        .query("select * from public.users where id=$1;",[id])
        .then((res) => {
          // console.log(res);
          if (res.rowCount == 0) {
              cb("error");
          }
          else {
              cb(null, res.rows[0]);
          }
        })
        .catch((e) => {
          cb(e);
        });
      done();
  });
  
})

const {bootstrap, bootstrap_enum} = require("./db/models/bootstrap");

bootstrap_enum((err, done)=>{
  if(err){
    // console.log(err);
    bootstrap((err, done)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("DB ready");
      }
    })
  }
  else{
    bootstrap((err, done)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("DB ready");
      }
    })
  }
})

app.get("/", (req, res) => {
  res.render("home.ejs");
});

//  Connect all our routes to our application
app.use("/", routes);

// Turn on that server!
app.listen(3000, () => {
  console.log("App listening on port 3000");
});
