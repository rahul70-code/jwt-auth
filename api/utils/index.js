module.exports = {
 authVerify : function jwtAuth(access_token,cb) {
    jwt.verify(access_token, process.env.JWT_KEY, (err, user) => {
        // console.log(decoded)
        if (err) {
        var message = 'Auth token not valid'
           cb(err, null)
        } else {
            // console.log(user)
            cb(null,user)
        }
    });
}
};