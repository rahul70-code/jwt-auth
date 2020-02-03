var post = require('../models/post');
var jwtAuth = require('../utils/index').authVerify

var middlewareObject = {};

middlewareObject.postOwnership = (req, res, next) => {
    console.log(req.params.id)

    post.findById(req.params.id)
    .then(posts => {
        // console.log(req,"------------------")
        if(posts.author.id.equals(req.user.id)){
            next();
        }
    }).catch(e)(
        res.send({message: e})
        );
};

module.exports = middlewareObject;