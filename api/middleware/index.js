var post = require('../models/post');
var User = require('../models/user')
var jwtAuth = require('../utils/index').authVerify
var async = require('async')
var middlewareObject = {};

middlewareObject.postOwnership = (req, res, next) => {
    // console.log(req.params)
    async.waterfall([
        function(cb) {
            var access_token = req.query.access_token;
            jwtAuth(access_token,cb);
        },
        function(user,cb){
            // console.log(user)
            if(user != null) {
           post.findById(req.params.id, function(err,data){
            //    console.log(data)
            if(data) {
               if(user.userId == data.author.id) {
                   cb(null,next())
               } else {
                    res.send({message: 'You dont have permission'})
               }
            } else {
                next(new Error('post not found'))
            }
           });
        } else {
            cb('access_token is not valid')
        }
        }
    ], (err, results)=>{
        if(err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            // console.log(results)
          next()
        }

    });
  
};

middlewareObject.userOwnership = (req, res, next) => {
    console.log(req.params)
    async.waterfall([
        function(cb) {
            var access_token = req.query.access_token;
            jwtAuth(access_token,cb);
        },
        function(user,cb){
            console.log(user)
            if(user != null) {
           User.findById(req.params.id, function(err,data){
               console.log(data)
            if(data) {
               if(user.userId == data._id) {
                   cb(null,next())
               } else {
                    res.send({message: 'You dont have permission'})
               }
            } else {
                res.send(new Error('user not found'))
            }
           });
        } else {
           res.send('access_token is not valid')
        }
        }
    ], (err, results)=>{
        if(err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            // console.log(results)
          next()
        }

    });
  
};

module.exports = middlewareObject;