var post = require('../models/post');

var middlewareObject = {};

middlewareObject.postOwnership = (req, res, next) => {
    post.findById(req.params.id)
    .then(posts => {
        if(posts.author.id.equals(req.user._id)){
            next();
        }
    }).catch(error)(
        res.send({message: error})
        );
};

module.exports = middlewareObject;