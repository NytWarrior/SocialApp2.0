module.exports.profile = function (req, res) {
    //res.end('<h1>User Profile</h1>')
    return res.render('user_profile', {
        title: 'Profile'
    })
}


//render the signup page
module.exports.signUp = function (req, res) {
    return res.render('user_signUp', {
        title: "Sign Up"
    })
}

//render the signin page
module.exports.signIn = function (req, res) {
    return res.render('user_signIn', {
        title: "Sign In"
    })
}

//get the signup data
module.exports.create = function (req, res) {

}

module.exports.createSession = function (req, res) {

}