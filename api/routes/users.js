const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const checkToken = require('../../auth')
const User = require("../models/user");
const accessToken = require('../models/access_token');
const jwtAuth = require('../utils').authVerify;
const async = require('async')

router.get('/',checkToken, (req, res)=> {
  User.find({})
  .exec()
  .then((user) => {
      res.send(user)
  }).catch(err => {
      res.statusCode(400).send({message: err});
  });
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email, username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail/username exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              username: req.body.username,
              password: hash
            });
            user.save()
              .then(result => {
                // console.log(result);
                res.status(201).json({
                  message: "User created",
                  result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: 'Username/email exists'
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email, username: req.body.username })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                username: user[0].username,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );

            accessToken.create({token: token, userId: user[0]._id},(err, tokenObj)=> {
              if(err) {
                throw err
              } else {
                console.log(tokenObj)
              };
            });
              
            return res.status(200).json({
              message: "Auth successful",
              access_token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.delete("/:userId",checkToken,(req, res, next) => {
  // var access_token = req.query.access_token;

     async.waterfall([
        function(cb) {
            var access_token = req.query.access_token;
            jwtAuth(access_token,cb);
        },
        function(user,cb){
          if(user.userId == req.params.userId) {
            User.remove({ _id: req.params.userId })
            .exec()
            .then(result => {
              res.status(200).json({
                message: "User deleted"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
          } else {
            var message = 'you dont have permission'
            cb(null,message)
          }
        }
    ], (err, results)=>{
        if(err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            // console.log(results)
          next(results)
        }

    });

});

// forget password
router.get('/forgotpassword', function (req, res) {
  res.send('<form action="/passwordreset" method="POST">' +
      '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
      '<input type="submit" value="Reset Password" />' +
  '</form>');
});

module.exports = router;