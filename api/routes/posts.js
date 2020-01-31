const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const checkToken = require('../../auth');
const middleware = require('../middleware')

const Post = require('../models/post');

router.post('/posts', function (req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    console.log(req.query)
    if (!req.body.title) {
        return res.status(400).send({
            message: 'title cannot be blank'
        });
    } else {
        if (req.query.access_token) {
            var access_token = req.query.access_token;
            var user1 = await jwtAuth(access_token); // this is wrong ---> try async waterfall
            console.log(user1)
        var post = new Post({
            title: title,
            description: description,
            author: {
                id: user1._id,
                email: user1.email
            }
        });

        post.save()
            .then(data => {
                res.send(data);
                next()
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
    } else {
        res.send({
            message: 'Auth token has not supplied'
        })
    }
    }
});

router.get('/posts', function (req, res) {
    Post.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});

router.get('/posts/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            return res.status(404).send({
                message: err.message
            })
        } else {
            return res.send(post);
        }
    });
});

router.put('/posts/:id/update', middleware.postOwnership, function (req, res) {
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title || "Untitled Note",
        description: req.body.description
    }, { new: true })
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.send(post);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.id
            });
        });
});

router.delete('/posts/:id', middleware.postOwnership, function (req, res) {
    if (req.params) {
        Post.remove({ _id: req.params.id })
            .then(res.send({ message: 'Sucessfully deleted the post' }))
            .catch(err)(res.send({ message: err }))
    } else {
        res.send({
            message: 'Post not selected for deletion'
        })
    }
});

async function jwtAuth(access_token) {
    jwt.verify(access_token, process.env.JWT_KEY, (err, user) => {
        // console.log(decoded)
        if (err) {
            return res.json({
                success: false,
                message: 'Token is not valid'
            });
        } else {
            console.log(user)
            return user
        }
    });
}

module.exports = router;